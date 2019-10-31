import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';

import { BASE_URL } from '../../utils/constants';
import btn_normal from '../../assets/images/btn_google_signin_dark_normal_web.png';

const LoginButton: React.FC = () => {
  return (
    <ButtonBase>
      <a href={`${BASE_URL}/auth/user/login`}>
        <img src={btn_normal} alt="Log In Button" />
      </a>
    </ButtonBase>
  );
};

export default LoginButton;