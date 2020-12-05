import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getGroupListApi, getGroupMemberApi } from '@repository/groupRepository';
import Icon from '@components/Icon';
import TextButton from '@components/TextButton';
import ProfileInfoContainer from '@components/ProfileInfoContainer/ProfileInfoContainer';
import StudyCardView from '@components/StudyCardView';
import S from './StudyMainPage.style';
import { showModal } from '@store/Modal/modal';
import { MODALS } from '@utils/constant';
import Modal from '@components/Modal/Modal';
import usePageBottom from '@hooks/usePageBottom';

export default function StudyMainPage() {
  const dispatch = useDispatch();
  const isPageBottom = usePageBottom();
  const [groupList, setGroupList] = useState([]);
  const [member, setMember] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const fetch = async (page) => {
    getGroupListApi(page).then((res) => {
      const resLength = res.data.length;
      //const unit = resLength === 6 ? 1 : 0;
      const unit = resLength === 1 ? 0 : 1;
      res.data.map((val) => {
        getGroupMemberApi(val.id).then((response) => {
          console.log(`id ${val.id} member: ${response.data.length}`);
          setMember((member) => [...member, { id: val.id, member: response.data.length }]);
        });
      });
      // let length = groupList.length%6 === 0 ? groupList.length+resLength : groupList.length+resLength - (resLength%6);
      // if(length === 0) length = 6;
      //setGroupList((groupList)=>[...groupList, ...res.data].slice(0, length));
      setGroupList((groupList)=>[...groupList, ...res.data]);
      setLoading(true);
      setPage(page+unit);
    });
  };

  const handleStudyAddModal = () => {
    dispatch(showModal(MODALS.STUDY_MAKE_MODAL));
  }

  const handleReload = () => {
    setGroupList([]);
    setMember([]);
    for(let i = 0; i<page; i++){
      fetch(i);
    }
  }

  useEffect(() => {
    fetch(page);
  }, []);

  useEffect(()=>{
    if (!isPageBottom) return;
    console.log("bottom");
    fetch(page);
  }, [isPageBottom]);

  const ButtonList = [
    '이공계_사기업',
    '이공계_공기업',
    '인문계_사기업',
    '인문계_공기업',
    '자유_기타',
  ];
  
  return (
    <S.Wrapper>
      {page} 
      <br />
      {groupList.length}
      <br />
      {JSON.stringify(groupList)}
      <Modal modalName={MODALS.STUDY_MAKE_MODAL} func={handleReload}/>
      <S.SearchWrapper>
        <S.IconWrapper>
          <Icon type="search" alt="" />
        </S.IconWrapper>
        <S.Input placeholder="Search" />
      </S.SearchWrapper>
      <S.StudyText>
        현재 진행 중인 스터디 방
      </S.StudyText>
      <S.ContentWrapper>
        <S.BoxWrapper>
          <S.ListWrapper>
            <S.ButtonWrapper>
              {ButtonList.map((val) => (
                <S.TextButtonWrapper>
                  <TextButton text={val} />
                </S.TextButtonWrapper>
              ))}
              <S.FilterWrapper>
                <Icon type="filter" alt="" />
              </S.FilterWrapper>
            </S.ButtonWrapper>
            <S.StudyListWrapper>
              <S.Wrap onClick={handleStudyAddModal}>
                <S.AddStudy>
                  <Icon type="add_black" />
                  <S.AddText>
                    방 만들기
                  </S.AddText>
                </S.AddStudy>
              </S.Wrap>
              {groupList?.map((val) => {
                const count = member.filter((elem) => elem.id === val.id)[0];
                return (
                  <StudyCardView
                    id={val.id}
                    title={val.title}
                    description={val.description}
                    time={val.time}
                    member={count && count.member}
                  />
                );
              })}
            </S.StudyListWrapper>
          </S.ListWrapper>
          <S.PartiWrapper>
            <S.partiText>
              참여도 높은 유저
            </S.partiText>
            <ProfileInfoContainer />
            <ProfileInfoContainer />
            <ProfileInfoContainer />
            <ProfileInfoContainer />
            <ProfileInfoContainer />
            <ProfileInfoContainer />
            <ProfileInfoContainer />
          </S.PartiWrapper>
        </S.BoxWrapper>
      </S.ContentWrapper>
    </S.Wrapper>
  );
}