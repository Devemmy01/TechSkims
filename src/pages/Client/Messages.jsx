import React, { useEffect } from 'react';

const Messages = () => {
  useEffect(() => {
    // Initialize Tawk.to script
    var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
    (function() {
      var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/67c698369e98e5190fe9566f/1ilfs55cq';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div>Client Messages</div>
  );
};

export default Messages;