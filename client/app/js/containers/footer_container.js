

import React from "react";
export default class FooterContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render(){
    return <footer>
        <div className="footTop"><span><img src="assets/footerIcn.png" alt="Footer Icon" /></span></div>
        <div className="footBtm"></div>
    </footer>
  }

}