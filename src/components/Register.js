    import React, { useRef, useState, useEffect, useContext } from "react";
    import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
    import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
    import { Link, useNavigate } from 'react-router-dom';
    import Header from './Header';
    import AuthContext from "../context/AuthProvider"; // Assuming usage for demonstration
    import SecondHeader from "./SecondHeader";
    const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
    const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const REGISTER_URL = 'https://bookclubserver.vercel.app/api/register';

    const Register = ({ isDarkMode }) => {
        const { setAuth } = useContext(AuthContext); // Placeholder for context use
        const userRef = useRef();
        const errRef = useRef();

        const [user, setUser] = useState('');
        const [validName, setValidName] = useState(false);
        const [userFocus, setUserFocus] = useState(false);

        const [pwd, setPwd] = useState('');
        const [validPwd, setValidPwd] = useState(false);
        const [pwdFocus, setPwdFocus] = useState(false);

        const [matchPwd, setMatchPwd] = useState('');
        const [validMatch, setValidMatch] = useState(false);
        const [matchFocus, setMatchFocus] = useState(false);

        const [email, setEmail] = useState('');
        const [validEmail, setValidEmail] = useState(false);
        const [emailFocus, setEmailFocus] = useState(false);

        const [errMsg, setErrMsg] = useState('');
        const [success, setSuccess] = useState(false);

        useEffect(() => {
            userRef.current.focus();
        }, []);

        useEffect(() => {
            const result = USER_REGEX.test(user);
            setValidName(result);
        }, [user]);

        useEffect(() => {
            const result = PWD_REGEX.test(pwd);
            setValidPwd(result);
            setValidMatch(pwd === matchPwd);
        }, [pwd, matchPwd]);

        useEffect(() => {
            setErrMsg('');
        }, [user, pwd, matchPwd, email]);

        useEffect(() => {
            const result = EMAIL_REGEX.test(email);
            setValidEmail(result);
        }, [email]);

        const handleSubmit = async (e) => {
            e.preventDefault();
            // Validation checks are already in place, assuming valid input, proceed with the registration process
            const v1 = USER_REGEX.test(user);
            const v2 = PWD_REGEX.test(pwd);
            const v3 = pwd === matchPwd;
            const v4 = EMAIL_REGEX.test(email);

            if (!v1 || !v2 || !v3 || !v4) {
                setErrMsg("Invalid Entry");
                return;
            }

            try {
                const response = await fetch(REGISTER_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: user, password: pwd, email: email })
                });
                if (!response.ok) throw new Error('Failed to register');
                // Assuming response contains the user data including a username
                const data = await response.json();
                setAuth(data); // Update the auth context or manage authentication state as needed
                setSuccess(true);
                // Reset form fields
                setUser('');
                setPwd('');
                setMatchPwd('');
                setEmail('');
            } catch (err) {
                if (!err?.status) {
                    setErrMsg('No Server Response');
                } else if (err.status === 409) {
                    setErrMsg('Username Taken');
                } else {
                    setErrMsg('Registration Failed');
                }
                errRef.current.focus();
            }
        };

    // Tailwind CSS classes
    const formSectionStyle = `mt-6 p-10 rounded-lg shadow-md ${isDarkMode ? "bg-gray-700" : "bg-white"} w-full max-w-md`;
    const labelIconContainerStyle = `flex justify-between items-center mb-1`;
    const labelStyle = `text-xl font-bold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`;
    const inputStyle = `w-full px-4 py-2 rounded border focus:outline-none ${isDarkMode ? "bg-gray-600 border-gray-600 text-white" : "border-gray-300 text-gray-700"}`;
    const buttonStyle = `w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`;
    const noteStyle = `bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 shadow-lg rounded-lg p-2 text-sm mt-2`;

    const successStyle = `max-w-md px-6 py-4 border-0 rounded relative mb-4 bg-green-100 dark:bg-green-800`;
    const successTitleStyle = `text-2xl font-semibold mb-3 text-green-800 dark:text-green-200`;
    const successMessageStyle = `text-md mb-4 text-green-600 dark:text-green-300`;
    const successLinkStyle = `text-blue-500 hover:text-blue-700 dark:hover:text-blue-400`;  

    return (
        <div>
            <Header header="Sign Up" isDarkMode={isDarkMode} />   
            <div className={`min-h-screen flex flex-col items-center justify-center ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                {success ? (
                    <section className={`${successStyle}`}>
                        <h1 className={`${successTitleStyle}`}>Success!</h1>
                        <p className={`${successMessageStyle}`}>
                            You have successfully registered. Please sign in to continue.
                        </p>
                        <Link to="/signin" className={`${successLinkStyle}`}>Sign In</Link>
                    </section>
                ) : (
                    <section className={formSectionStyle}>
                        <p ref={errRef} className={`mb-4 text-center text-sm ${errMsg ? (isDarkMode ? "text-red-300" : "text-red-700") : "invisible"}`} aria-live="assertive">{errMsg}</p>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username field */}
                            <div className="space-y-2">
                                <div className={labelIconContainerStyle}>
                                    <label htmlFor="username" className={`${labelStyle} flex-grow`}>Username:</label>
                                    <FontAwesomeIcon icon={faCheck} className={`${validName ? "text-green-500" : "hidden"}`} />
                                    <FontAwesomeIcon icon={faTimes} className={`${user && !validName ? "text-red-500" : "hidden"}`} />
                                </div>
                                <input
                                    type="text"
                                    id="username"
                                    ref={userRef}
                                    autoComplete="off"
                                    onChange={(e) => setUser(e.target.value)}
                                    value={user}
                                    required
                                    aria-invalid={!validName}
                                    aria-describedby="uidnote"
                                    onFocus={() => setUserFocus(true)}
                                    onBlur={() => setUserFocus(false)}
                                    className={`${inputStyle} ${user && !validName ? "border-red-500" : ""}`}
                                />
                                <p id="uidnote" className={`${userFocus && user && !validName ? "block" : "hidden"} ${noteStyle}`}>
                                    <FontAwesomeIcon icon={faInfoCircle} className="text-blue-600" />
                                    4 to 24 characters. Must begin with a letter. Letters, numbers, underscores, hyphens allowed.
                                </p>
                            </div>

                            {/* Password field */}
                            <div className="space-y-2">
                                <div className={labelIconContainerStyle}>
                                    <label htmlFor="password" className={`${labelStyle} flex-grow`}>Password:</label>
                                    <FontAwesomeIcon icon={faCheck} className={`${validPwd && pwd ? "text-green-500" : "hidden"}`} />
                                    <FontAwesomeIcon icon={faTimes} className={`${pwd && !validPwd ? "text-red-500" : "hidden"}`} />
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    onChange={(e) => setPwd(e.target.value)}
                                    onFocus={() => setPwdFocus(true)}
                                    onBlur={() => setPwdFocus(false)}
                                    value={pwd}
                                    required
                                    className={`${inputStyle} ${!validPwd && pwd ? "border-red-500" : ""}`}
                                    aria-invalid={!validPwd}
                                />
                                <p id='pwdnote' className={`${pwdFocus && !validPwd ? "block" : "hidden"} ${noteStyle}`}>
                                    <FontAwesomeIcon icon={faInfoCircle} className="text-blue-600" />
                                    8 to 24 characters. Must include uppercase and lowercase letters, a number, and a special character. Allowed special characters: ! @ # $ %
                                </p>
                            </div>

                            {/* Confirm Password field */}
                            <div className="space-y-2">
                                <div className={labelIconContainerStyle}>
                                    <label htmlFor="confirm_pwd" className={`${labelStyle} flex-grow`}>Confirm Password:</label>
                                    <FontAwesomeIcon icon={faCheck} className={`${validMatch && matchPwd ? "text-green-500" : "hidden"}`} />
                                    <FontAwesomeIcon icon={faTimes} className={`${matchPwd && !validMatch ? "text-red-500" : "hidden"}`} />
                                </div>
                                <input
                                    type="password"
                                    id="confirm_pwd"
                                    onChange={(e) => setMatchPwd(e.target.value)}
                                    onFocus={() => setMatchFocus(true)}
                                    onBlur={() => setMatchFocus(false)}
                                    value={matchPwd}
                                    required
                                    className={`${inputStyle} ${matchPwd && !validMatch ? "border-red-500" : ""}`}
                                    aria-invalid={!validMatch ? "true" : "false"}
                                />
                                <p id="confirmnote" className={`${matchFocus && !validMatch ? "block" : "hidden"} ${noteStyle}`}>
                                    <FontAwesomeIcon icon={faInfoCircle} className="text-blue-600" />
                                    Must match the first password input field.
                                </p>
                                </div>


                            {/* Email field */}
                            <div className="space-y-2">
                            <div className={labelIconContainerStyle}>
                                <label htmlFor="email" className={`${labelStyle} flex-grow`}>Email:</label>
                                <FontAwesomeIcon icon={faCheck} className={`${validEmail && email ? "text-green-500" : "hidden"}`} />
                                <FontAwesomeIcon icon={faTimes} className={`${email && !validEmail ? "text-red-500" : "hidden"}`} />
                            </div>
                            <input
                                type="email"
                                id="email"
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setEmailFocus(true)}
                                onBlur={() => setEmailFocus(false)}
                                value={email}
                                required
                                className={`${inputStyle} ${email && !validEmail ? "border-red-500" : ""}`}
                                aria-invalid={!validEmail ? "true" : "false"}
                            />
                            <p id="emailnote" className={`${emailFocus && !validEmail ? "block" : "hidden"} ${noteStyle}`}>
                                <FontAwesomeIcon icon={faInfoCircle} className="text-blue-600" />
                                Must be a valid email address.
                            </p>
                            </div>


                            {/* Submit button */}
                            <button type="submit" className={buttonStyle} disabled={!validName || !validPwd || !validMatch || !validEmail}>
                                Sign Up
                            </button>

                            {/* Sign in link */}
                            <p className={`text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                Already Registered?<br />
                                <Link to="/signin" className="text-blue-500 hover:text-blue-700">Sign In</Link>
                            </p>
                        </form>
                    </section>
                )}
            </div>
        </div>
    );
    };

    export default Register;
