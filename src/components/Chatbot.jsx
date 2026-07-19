import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot } from 'lucide-react'; // Removing MessageSquare, using custom img
import { getBotResponse } from '../utils/chatLogic';
import './Chatbot.css';
import kakarotImg from '../assets/kakarot_chibi.png';

const Chatbot = ({ userName }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: `Yo ${userName || 'fighter'}! I'm **Kakarot**. Let's train! Ask me anything about the app.`, sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showBubble, setShowBubble] = useState(true); // Control speech bubble
    const messagesEndRef = useRef(null);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen) setShowBubble(false); // Hide bubble when opened
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Hide bubble after 8 seconds if not interacted
    useEffect(() => {
        const timer = setTimeout(() => setShowBubble(false), 8000);
        return () => clearTimeout(timer);
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMsg = { id: Date.now(), text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        try {
            const responseText = await getBotResponse(userMsg.text, userName);
            const botMsg = { id: Date.now() + 1, text: responseText, sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("Bot Error:", error);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Speech Bubble */}
            <AnimatePresence>
                {showBubble && !isOpen && (
                    <motion.div
                        className="kakarot-bubble"
                        initial={{ opacity: 0, x: 20, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                    >
                        Yo! I'm Kakarot!
                        <div className="bubble-arrow"></div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Action Button (Kakarot Face) */}
            <motion.button
                className="chatbot-fab kakarot-head"
                onClick={toggleChat}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
            >
                {isOpen ? (
                    <X size={24} />
                ) : (
                    <img src={kakarotImg} alt="Kakarot" className="kakarot-avatar-fab" />
                )}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="chatbot-window"
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                        <div className="chatbot-header">
                            <div className="chatbot-title">
                                <div className="header-avatar">
                                    <img src={kakarotImg} alt="K" />
                                </div>
                                <span>Kakarot AI</span>
                            </div>
                            <button onClick={toggleChat} className="chatbot-close"><X size={18} /></button>
                        </div>

                        <div className="chatbot-messages">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`message-bubble ${msg.sender}`}>
                                    {msg.sender === 'bot' && (
                                        <div className="bot-avatar-small">
                                            <img src={kakarotImg} alt="K" />
                                        </div>
                                    )}
                                    <span dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                </div>
                            ))}
                            {isTyping && (
                                <div className="message-bubble bot typing">
                                    <div className="bot-avatar-small"><img src={kakarotImg} alt="K" /></div>
                                    <span>•</span><span>•</span><span>•</span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form className="chatbot-input-area" onSubmit={handleSend}>
                            <input
                                type="text"
                                placeholder="Ask Kakarot..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                            <button type="submit" disabled={!inputText.trim()}>
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;
