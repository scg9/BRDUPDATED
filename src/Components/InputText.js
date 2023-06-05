import react, { useEffect, useState } from 'react';
import Errors from './Errors';
import axios from 'axios';

const Inputtext = () => {
  const [inputValue, setInputValue] = useState('');
  const [inputList, setInputList] = useState([]);
  const [responseData, setResponseData] = useState('');
  const [previewvalue, setPreviewvalue] = useState('');
  const [showbrdsuccess, setShowbrdsuccess] = useState(false);
  const [leftText, setLeftText] = useState("");
  const [rightText, setRightText] = useState("");

  const HandleChangeSelectedHistory = () => {
    if (inputValue.trim() !== '') {
      if (inputList.length >= 10) {
        setInputList((prev) => prev.slice(1))
      }
      setInputList((prev) => [...new Set([...prev, inputValue])])

    }
  }
  const Handleclosebrd = () => {
    setShowbrdsuccess(false);
  }

  const DownloadBrd = () => {
    if (!showbrdsuccess) {
      setLeftText("Please generate BRD first");
      return;
    }
    setShowbrdsuccess(false);
    const element = document.createElement('a');
    const file = new Blob([responseData], { type: 'application/msword' })
    element.href = URL.createObjectURL(file);
    element.download = 'downloadFile.doc';
    element.click();
  }

  const PreviewBrd = () => {
    if (!showbrdsuccess) {
      setRightText("Please generate BRD first");
      return;
    }
    setPreviewvalue(responseData)
  }

  const handleInputchange = (e) => {
    setInputValue(e.target.value);
    setShowbrdsuccess(false)
    setLeftText("");
    setRightText("");

  }
  useEffect(() => {
    const handleHamburgerClick = () => {
      document.querySelector('.sidebar').classList.toggle('open');
    };

    const handleScreenChange = () => {

      if (window.matchMedia("(max-width: 769px)").matches) {
        document.querySelector('.sidebar').classList.remove('open');
      } else {
        document.querySelector('.sidebar').classList.add('open');
      }

    };

    const allNavItems = document.querySelectorAll('.nav-item');

    const closeAllOthers = () => {
      allNavItems.forEach((navItem) => {
        navItem.classList.remove('selected');
      });
    };

    const handleNavItemClick = (navItem) => {
      closeAllOthers();
      navItem.classList.add('selected');

      setTimeout(() => {
        navItem.classList.remove('selected');
      }, 3000);
    };

    document.querySelector('.hamburger').addEventListener('click', handleHamburgerClick);

    allNavItems.forEach((navItem) => {
      navItem.addEventListener('click', () => handleNavItemClick(navItem));
    });

    window.addEventListener('resize', handleScreenChange);
    handleScreenChange();
    return () => {
      document.querySelector('.hamburger').removeEventListener('click', handleHamburgerClick);
      allNavItems.forEach((navItem) => {
        navItem.removeEventListener('click', () => handleNavItemClick(navItem));
      });
      window.removeEventListener('resize', handleScreenChange);
    };
  }, []);

  const postdata = async () => {
    try {
      if (inputValue.trim().length < 3) {
        setLeftText("Minimum 3 characters required to generate BRD");
        return;
      }
      const res = await axios.post('http://localhost:3001/brd', { value: inputValue })
        .then((response) => {
          console.log(response.data.message, "response")
          setResponseData(response.data.message)
          setLeftText("");
          setRightText("");
          setShowbrdsuccess(true);
          HandleChangeSelectedHistory();

        })

    }
    catch (err) {
      console.log("err", err);
    }
  }
  console.log(inputList, "inputlist")

  return (
    <>
      <div className="content">
        <div>
          <div className="text-area">
            <textarea placeholder="Generate brd" value={inputValue} onChange={handleInputchange} required></textarea>
            <div className='downloadbtn'>
              <button onClick={postdata}>Generate Brd</button>

              <button onClick={DownloadBrd}>Download Brd</button>
            </div>
          </div>
          <p className='errors' id='left'>{leftText}</p>

        </div>
        <div className='text-area-and-errors'>
          <div className="text-area">
            <textarea placeholder="Preview Brd" disabled value={previewvalue}></textarea>
            <button onClick={PreviewBrd} >Preview Brd</button>
          </div>
          <p className='errors' id='right'>{rightText}</p>

        </div>
      </div>
      <div className="sidebar open">
        <h3>Select History</h3>
        <ul>
          {inputList.map((value, key) => (
            <li > <span key={key} value={value} onClick={() => {
              setInputValue(value)
              setShowbrdsuccess(false);
              setLeftText("");
              setRightText("");
            }}>{value}</span></li>
          ))}
        </ul>
      </div>
      {showbrdsuccess &&
        (<div className="Brdsuccessful">
          <span> Brd Generated sucessfully</span>
          <button className='closebrdbtn' onClick={Handleclosebrd}> Close</button>
        </div>)
      }

      <div className="hamburger">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </>
  )
}
export default Inputtext;
