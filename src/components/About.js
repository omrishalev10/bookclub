import React from 'react';
import Header from './Header';
import RanP from '../images/RanP.jpg';
import Omri from '../images/Omri.jpg';
import Tanya from '../images/Tanya.jpg';
import Almog from '../images/Almog.jpg';

const About = ({ isDarkMode }) => {
  return (
    
    <div>
      <Header header='About Us' isDarkMode={isDarkMode}/>
      <div className="min-h-screen flex flex-col text-center justify-center items-center py-12" >
        <p className={`mt-2 text-lg mx-auto leading-relaxed max-w-2xl ${isDarkMode ? 'text-white' : 'text-gray-700 '}`}>
        It all started with a simple idea: what if there was a cozy corner on the internet just for book lovers? We imagined a place where people could gather to chat about their favorite books, share reviews, and discover new reads. That's how our site came to life—a straightforward spot for readers to connect and share their passion for books.
        Whether you want to keep a list of books you're itching to read, track the books you've loved, or start a book club with friends old and new, we've made it easy. Our site is all about connecting over books, without any fuss. Just readers, books, and good conversation.   
        </p>
        
        <h3 className={`text-3xl font-semibold mt-16 mb-4 ${isDarkMode ? 'text-white' : 'text-gray-700 '} `}>Who We Are</h3>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Team Member Omri Shalev */}
          <div className={`mb-5 ${isDarkMode ? 'text-white' : 'text-gray-700 '}`}> 
            <img src={Omri} alt="Omri Shalev" className="w-40 h-40 mx-auto rounded-full mb-3" />
            <p className="text-xl font-bold">Omri Shalev</p>
            <p className="text-sm">Co-Founder & Backend Architect</p>
            <p className="text-sm mt-2">Omri keeps our digital shelves organized and running smoothly, so you can find and enjoy your books without a hitch.</p>
          </div>
          
          {/* Team Member Tanya Gendelman */}
          <div className={`mb-5 ${isDarkMode ? 'text-white' : 'text-gray-700 '}`}>           <img src={Tanya} alt="Tanya Gendelman" className="w-40 h-40 mx-auto rounded-full mb-3" />
            <p className="text-xl font-bold">Tanya Gendelman</p>
            <p className="text-sm">Co-Founder & Reader Relations Lead</p>
            <p className="text-sm mt-2">Tanya is the friendly face connecting readers, making sure your experience on our site feels like a cozy book club meeting.</p>
          </div>
          
          {/* Team Member Almog Kadosh */}
          <div className={`mb-5 ${isDarkMode ? 'text-white' : 'text-gray-700 '}`}>           <img src={Almog} alt="Almog Kadosh" className="w-40 h-40 mx-auto rounded-full mb-3" />
            <p className="text-xl font-bold">Almog Kadosh</p>
            <p className="text-sm">Co-Founder & UX Designer</p>
            <p className="text-sm mt-2">Almog crafts the site with attention to detail, inviting users into an intuitive world.</p>
          </div>
          
          {/* Team Member Ran Polac */}
          <div className={`mb-5 ${isDarkMode ? 'text-white' : 'text-gray-700 '}`}>           <img src={RanP} alt="Ran Polac" className="w-40 h-40 mx-auto rounded-full mb-3" />
            <p className="text-xl font-bold">Ran Polac</p>
            <p className="text-sm">Co-Founder & Frontend Magician</p>
            <p className="text-sm mt-2">Ran weaves magic into our interface, ensuring smooth and delightful interactions.</p>
          </div>
        </div>
      </div>
    </div>

  );
};

export default About;