import react from "react";
const Errors = (props) => {
  return (
    <>
      <span className={props.className}> Min 3 character is required</span>
      <span className={props.className}>Please Generate brd first</span>
    </>
  );
};
export default Errors;
