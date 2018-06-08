module.exports = {
  server: {
    host: 'localhost',
    port: 80,
    secure_port: 443
  },
  db: {
    dbhost: 'localhost',
    dbport: 3306,
    dbname: 'cluck',
    dbuser: 'mysql',
    dbpass: 'mysql'
  },
  jwt: {
    key: 'WhY#=ovjii5|SI6h.77H-8k[];1Q-Zzs_W<M`p8uz,X2uP|=1n|@r@;D7}%@,.*Q',
    access: {
      expiresIn: 300,
      notBefore: 1,
      audience: 'Cluck client application',
      issuer: 'Cluck API',
      subject: 'access_token'
    },
    refresh: {
      expiresIn: 600,
      notBefore: 1,
      audience: 'Cluck client application',
      issuer: 'Cluck API',
      subject: 'refresh_token'
    }
  },
  crypto: {
    salt: '|6U}S=Hw3!U!VfV7QZ77>w3%?m_];5XmOcvaSH^j&d4Pz+m]%kI*c`BG?l&]v!9-',
    key: ':9Kcv^y5Xbgl3#YZ-eAdrs(<~fE|Y^6~fG*^nA}RAq]JQPoK~mS@9D:vQCcstl7,'
  }
};
