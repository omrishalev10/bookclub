import React from 'react';
import Header from './Header';

const ContactUs = ({ isDarkMode }) => {
  const members = [
    { id: 1, name: "Ran Polac", email: "ranpolac@gmail.com" },
    { id: 2, name: "Omri Shalev", email: "omrishalev@gmail.com" },
    { id: 3, name: "Tanya Gendelman", email: "tanya@gmail.com" },
    { id: 4, name: "Almog Kadosh", email: "almog@gmail.com" }
  ];

 // Styles
 const containerStyle = `flex flex-col text-center items-center pt-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`; // Reduced top padding
 const textStyle = `text-xl font-mono mx-auto leading-relaxed max-w-2xl ${isDarkMode ? 'text-white' : 'text-gray-700 '}`;
 const memberContainerStyle = `p-4 rounded-md border ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`;
 const memberTextStyle = `font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`;
 const memberEmailStyle = `text-blue-500 ${isDarkMode ? 'dark:text-blue-400' : ''}`;

 return (
   <div>
     <Header header='Contact Us' isDarkMode={isDarkMode}/>
     <div className={containerStyle}> 
       <p className={textStyle}>
         If you've encountered any problems while using our site or if you have any questions, feel free to reach out to any of our team members listed below. We're here to help and ensure you have the best experience possible.
       </p>
       <section className="w-full max-w-2xl px-6 pb-12">
         <div className="space-y-4 mt-4"> {/* You can adjust the margin here */}
           {members.map((member) => (
             <div key={member.id} className={`${memberContainerStyle} flex justify-between items-center`}>
               <p className={memberTextStyle}>{member.name}</p>
               <a href={`mailto:${member.email}`} className={memberEmailStyle}>{member.email}</a>
             </div>
           ))}
         </div>
       </section>  
     </div>
   </div>
 );
};

export default ContactUs;
