import { StyleSheet } from 'aphrodite/no-important';
import arrow from 'images/arrow.png';

export default StyleSheet.create({
  formItem: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    boxSizing: 'border-box',
    padding: '5px 10px',
    marginBottom: '20px',
    background: '#ffffff',
  },
  formSelect: {
    paddingRight: '37px',
    appearance: 'none',
    cursor: 'pointer',
    backgroundImage: `url(${arrow})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top 50% right 10px',
    outline: 'none',
    ':invalid': {
      color: '#cccccc',
    },
    ':-moz-focusring': {
      color: 'transparent',
      textShadow: '0 0 0 #000000',
    },
  },
  selectOption: {
    color: '#000000',
  },
  textArea: {
    minHeight: '100px',
    maxHeight: '100px',
  },
  formSubmit: {
    justifyContent: 'center',
    backgroundColor: '#ffbe6f',
    color: '#ffffff',
    cursor: 'pointer',
  },
  statusMsg: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    color: '#6c6c6c',
  },
});
