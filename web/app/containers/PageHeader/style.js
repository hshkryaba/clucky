import { StyleSheet } from 'aphrodite/no-important';
import logo from 'images/logo.png';

export default StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '1000px',
  },
  logo: {
    display: 'block',
    width: '70px',
    height: '70px',
    backgroundImage: `url(${logo})`,
    backgroundSize: 'cover',
  }
});
