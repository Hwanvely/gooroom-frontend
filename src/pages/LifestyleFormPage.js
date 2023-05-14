import LifestyleForm from 'components/LifestyleForm';
import Loading from 'components/common/Loading/Loading';
import Section from 'components/common/Section';
import CODE from 'constants/errorCode';
import {LOGIN} from 'constants/path';
import useLifestyle from 'hooks/useLifestyle';
import useMember from 'hooks/useMember';
import {useState} from 'react';
import {useEffect} from 'react';
import {Navigate} from 'react-router-dom';
import UnexpectedPage from './UnexpectedPage';

const LifestyleFormPage = () => {
  const title = '당신은 어떤 사람인가요?';
  const description = `생활 패턴, 청소 주기, MBTI까지, \n당신이 찾아 헤맨 완벽한 친구를 구해줄게요.`;

  const [unexpectedError, setUnexpectedError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const {member, getMember} = useMember();
  const {lifestyle, getLifestyle} = useLifestyle();

  useEffect(() => {
    const getDatas = async () => {
      const response = await getMember();

      switch (response) {
        case CODE.INVALIDATE_TOKEN:
          setIsLoggedIn(false);
          break;
        case CODE.UNEXPECTED:
          setUnexpectedError(true);
          break;
        default:
          await getLifestyle(response?.nickname);
      }

      setLoading(false);
    };
    getDatas();
  }, []);

  if (unexpectedError) {
    return <UnexpectedPage />;
  }

  // 서버에서 데이터를 가져오는 중에는 로딩화면 렌더링
  if (loading) {
    return <Loading />;
  }

  // 로그인 하지 않은 사용자인 경우 로그인 페이지로 리다이렉트
  if (!isLoggedIn) {
    return <Navigate to={LOGIN} replace={true} />;
  }

  return (
    <Section title={title} description={description}>
      <LifestyleForm member={member} lifestyle={lifestyle}></LifestyleForm>
    </Section>
  );
};

export default LifestyleFormPage;
