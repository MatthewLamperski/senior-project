import React from 'react';
import {Link} from "react-router-dom";

const Captcha = () => {
  return (
    <div style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <p>
        There will be some other steps here like a captcha.
      </p>
      <Link to="/experiment" style={{margin: 10}}>Next</Link>
    </div>
  );
};

export default Captcha;
