import { StyleSheet } from 'aphrodite/no-important';

export default StyleSheet.create({
  userProfile: {
    display: 'flex',
    flexDirection: 'column',
    width: '500px',
  },
  userAvatar: {
    width: '200px',
    alignSelf: 'center',
    position: 'relative',
    marginBottom: '20px',
  },
  userAvatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
  },
  userAvatarShadow: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    boxShadow: 'inset 0 0 0px 3px #000000',
  },
  userName: {
    alignSelf: 'center',
    font: 'bold 24px Helvetica Neue, Helvetica, Arial, sans-serif',
    color: '#000000',
    marginBottom: '15px',
  },
  infoRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  infoRowTitle: {
    width: '50%',
    textAlign: 'right',
    font: 'bold 20px Helvetica Neue, Helvetica, Arial, sans-serif',
    color: '#000000',
  },
  infoRowValue: {
    width: '50%',
    paddingLeft: '20px',
    textAlign: 'left',
    font: 'bold 22px Helvetica Neue, Helvetica, Arial, sans-serif',
    color: '#000000',
  },
});
