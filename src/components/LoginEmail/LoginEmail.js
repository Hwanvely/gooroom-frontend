import {Card} from 'react-bootstrap';
import AuthForm from 'components/common/AuthForm';
import Link from 'components/common/Link';
import LoginForm from './LoginForm';
import {useForm} from 'react-hook-form';
import {postLogin} from 'apis/auth';
import {useNavigate} from 'react-router-dom';
import {yupResolver} from '@hookform/resolvers/yup';
import {validationSchema} from './validationSchema';
import {useAlert} from 'hooks/useAlert';
import {useAuthDispatch} from 'hooks/useAuth';
import {setRefreshToken} from 'utils/RefreshToken';
import {SIGNUP} from 'constants/path';

const LoginEmail = ({title}) => {
  // 로그인 폼에서 필드의 값과 유효성 검증을 위해 사용
  const formMethods = useForm({
    resolver: yupResolver(validationSchema),
  });

  const navigate = useNavigate(); // 페이지 이동을 위해 사용

  const showAlert = useAlert(); // 알림 창 표시를 위한 훅

  const authDispatch = useAuthDispatch();

  /**
   * 로그인 폼에서 submit 이벤트가 발생하고 모든 필드가 유효한 경우 수행되는 함수이다.
   * @param {object} data - react-hook-form을 통해 관리하는 필드의 값이다.
   */
  const onSubmit = data => {
    const {email, password} = data;
    const body = JSON.stringify({
      email,
      password,
    });

    try {
      const response = postLogin(body);
      const data = JSON.parse(response?.data || '{}');

      // response.data가 없는 경우 에러 처리
      if (data.constructor === Object && Object.keys(data).length === 0) {
        throw new Error('서버가 불안정합니다. 문제가 계속될 시 문의바랍니다.');
      }

      if (!data['errorCode']) {
        // 에러 코드가 없는 경우, 로그인 성공
        setRefreshToken(data['Authorization-refresh']);
        authDispatch({type: 'SET_TOKEN', token: data['Authorization']});

        return navigate('/');
      } else {
        // TODO - 로그인 실패시 오류
      }
    } catch (err) {
      showAlert('danger', '로그인에 실패했습니다. 잠시 후 시도해주세요.', 2000);
    }
  };

  const onInvalid = errors => {};

  return (
    <>
      <AuthForm title={title}>
        <LoginForm
          formMethods={formMethods}
          onSubmit={onSubmit}
          onInvalid={onInvalid}
        ></LoginForm>
        <Card.Text className="mb-5 text-center">
          <Link to={SIGNUP}>회원가입하기</Link>
        </Card.Text>
      </AuthForm>
    </>
  );
};

export default LoginEmail;
