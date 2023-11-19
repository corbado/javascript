import React from 'react'

export const HorizontalRule = () => {
  const classes = "border-solid border-0 border-t border-t-light-color text-small text-center text-cd-3 h-cd-5 leading-6 overflow-visible my-cd-12 after:content-['or'] after:bg-white after:px-5 after:relative after:text-light-color after:-top-cd-6 after:text-cd-3"
  return (
    <hr className={classes}/>
  )
}
