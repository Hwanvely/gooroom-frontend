import {useEffect} from 'react';
import {Image} from 'react-bootstrap';
import {StyledProfile, StyledProfileName} from './styles';
import Tabs from 'components/common/Tabs';
import {useNavigate} from 'react-router-dom';
import {USERS_LIFESTYLE} from 'constants/path';
import PersonalPosts from './PersonalPosts';
import Settings from './Setting';
import FavoritePosts from './FavoritePosts';
import {useMember} from 'contexts/MemberContext';
import {useProfileImage} from 'contexts/ProfileImageContext';
import {useState} from 'react';
import {PROFILE_IMAGE} from 'constants/defaultValue';

const Profile = () => {
  const member = useMember();
  const [profile, setProfile] = useState({
    member: {...member},
    profileImage: PROFILE_IMAGE,
  });
  const profileImage = useProfileImage(profile.member.nickname);

  const navigate = useNavigate();

  // 마이페이지 탭 목록
  const tabList = [
    {id: 0, title: '내 글 보기'},
    {id: 1, title: '계정 관리'},
    {id: 2, title: '찜 목록'},
  ];

  // 마이페이지 탭 우측 버튼
  const tabButton = {
    title: '나는 이런 사람이에요',
    onClick: () => {
      navigate(`${USERS_LIFESTYLE}/${profile.member.nickname}`);
    },
  };

  // 컴포넌트가 마운트될 때 로그인 중인 사용자의 프로필을 서버에게 받아온다.
  useEffect(() => {
    setProfile({member: {...member}, profileImage});
  }, [member, profileImage]);

  return (
    <StyledProfile>
      <Image
        roundedCircle
        width="128"
        height="auto"
        src={profile.profileImage}
      />
      <StyledProfileName>{profile.member.name}</StyledProfileName>
      <Tabs tabList={tabList} tabButton={tabButton}>
        <PersonalPosts />
        <Settings profile={profile} setProfile={setProfile} />
        <FavoritePosts />
      </Tabs>
    </StyledProfile>
  );
};

export default Profile;
