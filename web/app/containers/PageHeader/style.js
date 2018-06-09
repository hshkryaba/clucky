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
  logoBlock: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoHeader: {
    fontSize: '30px',
  },
  logo: {
    display: 'block',
    width: '70px',
    height: '70px',
    marginRight: '10px',
    backgroundImage: `url(${logo})`,
    backgroundSize: 'cover',
  },
});
