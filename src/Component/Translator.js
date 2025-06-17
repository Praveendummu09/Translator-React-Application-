import languages from "../language";
import React, { useState } from "react";
function Translator(){

    const [fromText, setFromText] = useState("");
    const [toText, setToText] = useState("");
    const [fromLanguage, setFromLanguage] = useState("en-GB");
    const [toLanguage, setToLanguage] = useState("te-IN");

    const handleExchange = () => {
        setFromLanguage(toLanguage);
        setToLanguage(fromLanguage);
        const temp = fromText;
        setFromText(toText);
        setToText(temp);
    }

    const handleIconClickspeak = (target, type) => {
        if (type === 'from') {
            const utterance = new SpeechSynthesisUtterance(fromText);
            utterance.lang = fromLanguage;
            speechSynthesis.speak(utterance);
        } else if (type === 'to') {
            const utterance = new SpeechSynthesisUtterance(toText);
            utterance.lang = toLanguage;
            speechSynthesis.speak(utterance);
        }
    }

    const handleIconClick = (target, type) => {
        
        if (target.id === "from") {
            navigator.clipboard.writeText(fromText);
            alert("Copied to clipboard: " + fromText);
        } else if (target.id === "to") {
            navigator.clipboard.writeText(toText);
            alert("Copied to clipboard: " + toText);
        }
    }
    const handleTranslate = () => {
        const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(fromText)}&langpair=${fromLanguage}|${toLanguage}`;
        
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.responseData) {
                    setToText(data.responseData.translatedText);
                } else {
                    alert("Translation failed. Please try again.");
                }
            })
            .catch(error => {
                console.error("Error fetching translation:", error);
                alert("An error occurred while translating. Please try again.");
            });
    }
    return(
        <>
            <div className="wrapper">
                <div className="text-input">
                    <textarea className="from-text" id="from" name="from" placeholder="Enter the text" value={fromText} onChange={(e)=> setFromText(e.target.value)}></textarea>
                    <textarea className="to-text" id="from" name="from" aria-readonly="true" value={toText} readOnly></textarea>
                </div>

                <ul className="controls">
                    <li className="row from">
                        <div className="icons">
                            <i id="from" class="fa-solid fa-volume-high" onClick={(e)=>handleIconClickspeak(e.target,'from')}></i>
                            <i id="from" class="fa-solid fa-copy" onClick={(e)=>handleIconClick(e.target,'from')}></i>
                            
                        </div>
                        <select value={fromLanguage} onChange={(e) => setFromLanguage(e.target.value)}>
                            {Object.keys(languages).map((key) => (
                                <option key={key} value={key}>
                                    {languages[key]}
                                </option>
                            ))}
                        </select>
                    </li>
                    <li className="exchange" onClick={handleExchange}>
                        <i class="fa-solid fa-right-left"></i>
                    </li>
                    <li className="row to">
                        <select value={toLanguage} onChange={(e) => setToLanguage(e.target.value)}>
                                {Object.keys(languages).map((key) => (
                                <option key={key} value={key} selected={key === "en-GB"}>
                                    {languages[key]}
                                </option>
                            ))}
                            </select>
                        <div className="icons">
                            
                            <i id="to" class="fa-solid fa-volume-high" onClick={(e)=>handleIconClickspeak(e.target,'to')}></i>
                            <i id="to" class="fa-solid fa-copy" onClick={(e) => handleIconClick(e.target,'to')}></i>
                            
                        </div>
                        
                    </li>
                </ul>

            </div>
            <button onClick={handleTranslate}>Translate</button>
        </>
    )
}
export default Translator;