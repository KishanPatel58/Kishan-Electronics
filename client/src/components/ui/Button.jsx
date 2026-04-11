import React from 'react'

const Button = ({type,link,title,Value,setValue}) => {
  if(type === "link"){
    return (
      <a href={link} className=''>
        {title}
      </a>
    );
  }else{
    return (
       <button>{title}</button>
    )
  }
}

export default Button