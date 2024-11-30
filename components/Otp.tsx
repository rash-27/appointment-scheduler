
import * as React from 'react';
import { Input as BaseInput } from '@mui/base/Input';
import { Box, styled } from '@mui/system';
import { ThemeContext } from './Appbar';
import { Button as BaseButton, buttonClasses } from '@mui/base/Button';
import Link from 'next/link';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function OTP({
  separator,
  length,
  value,
  onChange,
}: {
  separator: React.ReactNode;
  length: number;
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
}) {
  const inputRefs = React.useRef<HTMLInputElement[]>(new Array(length).fill(null));

  const focusInput = (targetIndex: number) => {
    const targetInput = inputRefs.current[targetIndex];
    targetInput.focus();
  };

  const selectInput = (targetIndex: number) => {
    const targetInput = inputRefs.current[targetIndex];
    targetInput.select();
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    currentIndex: number,
  ) => {
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case ' ':
        event.preventDefault();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (currentIndex > 0) {
          focusInput(currentIndex - 1);
          selectInput(currentIndex - 1);
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (currentIndex < length - 1) {
          focusInput(currentIndex + 1);
          selectInput(currentIndex + 1);
        }
        break;
      case 'Delete':
        event.preventDefault();
        onChange((prevOtp) => {
          const otp =
            prevOtp.slice(0, currentIndex) + prevOtp.slice(currentIndex + 1);
          return otp;
        });

        break;
      case 'Backspace':
        event.preventDefault();
        if (currentIndex > 0) {
          focusInput(currentIndex - 1);
          selectInput(currentIndex - 1);
        }

        onChange((prevOtp) => {
          const otp =
            prevOtp.slice(0, currentIndex) + prevOtp.slice(currentIndex + 1);
          return otp;
        });
        break;

      default:
        break;
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    currentIndex: number,
  ) => {
    const currentValue = event.target.value;
    let indexToEnter = 0;

    while (indexToEnter <= currentIndex) {
      if (inputRefs.current[indexToEnter].value && indexToEnter < currentIndex) {
        indexToEnter += 1;
      } else {
        break;
      }
    }
    onChange((prev) => {
      const otpArray = prev.split('');
      const lastValue = currentValue[currentValue.length - 1];
      otpArray[indexToEnter] = lastValue;
      return otpArray.join('');
    });
    if (currentValue !== '') {
      if (currentIndex < length - 1) {
        focusInput(currentIndex + 1);
      }
    }
  };

  const handleClick = (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>,
    currentIndex: number,
  ) => {
    selectInput(currentIndex);
  };

  const handlePaste = (
    event: React.ClipboardEvent<HTMLInputElement>,
    currentIndex: number,
  ) => {
    event.preventDefault();
    const clipboardData = event.clipboardData;

    // Check if there is text data in the clipboard
    if (clipboardData.types.includes('text/plain')) {
      let pastedText = clipboardData.getData('text/plain');
      pastedText = pastedText.substring(0, length).trim();
      let indexToEnter = 0;

      while (indexToEnter <= currentIndex) {
        if (inputRefs.current[indexToEnter].value && indexToEnter < currentIndex) {
          indexToEnter += 1;
        } else {
          break;
        }
      }

      const otpArray = value.split('');

      for (let i = indexToEnter; i < length; i += 1) {
        const lastValue = pastedText[i - indexToEnter] ?? ' ';
        otpArray[i] = lastValue;
      }

      onChange(otpArray.join(''));
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      {new Array(length).fill(null).map((_, index) => (
        <React.Fragment key={index}>
          <BaseInput
            slots={{
              input: InputElement,
            }}
            aria-label={`Digit ${index + 1} of OTP`}
            slotProps={{
              input: {
                ref: (ele) => {
                  inputRefs.current[index] = ele!;
                },
                onKeyDown: (event) => handleKeyDown(event, index),
                onChange: (event) => handleChange(event, index),
                onClick: (event) => handleClick(event, index),
                onPaste: (event) => handlePaste(event, index),
                value: value[index] ?? '',
              },
            }}
          />
          {index === length - 1 ? null : separator}
        </React.Fragment>
      ))}
    </Box>
  );
}

export default function OTPInput({otp, setOtp}) {
  const {data : session} = useSession();
  const theme = React.useContext(ThemeContext);
  const router = useRouter();
  function handleSendOTP(){
    if(session.user.role == 'DOCTOR'){
      axios.post(`/api/doctor/${session?.user.id}/sendotp`).
      then((res)=>{
        if(res.status == 200){
          alert('OTP Sent to your registered Mobile Number!');
        }else {
         alert('Something went wrong!!');
        }
      })
    }else {
      axios.post(`/api/user/${session?.user.id}/sendotp`).
      then((res)=>{
        if(res.status == 200){
          alert('OTP Sent to your registered Mobile Number!');
        }else {
         alert('Something went wrong!!');
        }
      })

    }
  }
    
  function verifyOTP(){
    if(session.user.role == 'DOCTOR'){
      axios.post(`/api/doctor/${session?.user.id}/verify`,{
      'verifyOTP' : otp,
      }).
      then((res)=>{
        if(res.status == 200){
          alert('Successfully verified !!');
          router.push('/validate');
        }else {
         alert('Something went wrong!!');
        }
      })
    }else {
      axios.post(`/api/user/${session?.user.id}/verify`,{
      'verifyOTP' : otp,
      }).
      then((res)=>{
        if(res.status == 200){
          alert('Successfully verified !!');
          router.push('/');
        }else {
         alert('Something went wrong!!');
        }
      })

    }
  }

  return (
    <div>
    <div className='text-xl font-bold text-center mb-6'>OTP Verification</div>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <OTP separator={<span>-</span>} value={otp} onChange={setOtp} length={4} />
    </Box>
    <div className='flex justify-center mt-5 text-center'>
      <div>
      <Button className='px-3 py-2' disabled={otp.length!=4} onClick={verifyOTP}>Verify</Button>
      <div className='mt-4 text-blue-500 cursor-pointer' onClick={handleSendOTP}>Resend OTP</div>
      </div>
      
    </div>
    </div>
  );
}

const blue = {
  100: '#DAECFF',
  200: '#80BFFF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const Button = styled(BaseButton)(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.5;
  background-color: ${blue[500]};
  padding: 8px 16px;
  border-radius: 8px;
  color: white;
  transition: all 150ms ease;
  cursor: pointer;
  border: 1px solid ${blue[500]};
  box-shadow: 0 2px 1px ${
    theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(45, 45, 60, 0.2)'
  }, inset 0 1.5px 1px ${blue[400]}, inset 0 -2px 1px ${blue[600]};

  &:hover {
    background-color: ${blue[600]};
  }

  &.${buttonClasses.active} {
    background-color: ${blue[700]};
    box-shadow: none;
    transform: scale(0.99);
  }

  &.${buttonClasses.focusVisible} {
    box-shadow: 0 0 0 4px ${theme.palette.mode === 'dark' ? blue[300] : blue[200]};
    outline: none;
  }

  &.${buttonClasses.disabled} {
    background-color: ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    color: ${theme.palette.mode === 'dark' ? grey[200] : grey[700]};
    border: 0;
    cursor: default;
    box-shadow: none;
    transform: scale(1);
  }
  `,
)

const InputElement = styled('input')(
  ({ theme }) => `
  width: 50px;
  height: 50px;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 4;
  padding: 8px 0;
  border-radius: 8px;
  text-align: center;
  color: ${theme === 'dark' ? grey[300] : grey[900]};
  background: ${theme === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme ? grey[700] : grey[200]};
  box-shadow: 0 2px 4px ${
    theme === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
  };
  
  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }

  /* firefox */
  &:focus-visible {
    outline: 0;
  }
`,

);


