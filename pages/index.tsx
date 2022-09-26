import { useDispatch, useSelector } from "react-redux";
import { fetchListOfSubTopicsAction } from "../store/actions";
import { HeaderComponent } from "../components/header.component";
import { css, Global } from "@emotion/react";
import { TextPromptCard } from "../components/textPromptCard.component";
import { Box, Container } from "@mui/material";
import styled from "@emotion/styled";

const StyledContainer = styled(Container)`
  margin-top: 20px;
`;

const AICarumba = () => {
  const dispatch = useDispatch();

  // get rid of any eventually, lazy ow
  const { subtopics } = useSelector((state: any) => ({
    subtopics: state.listOfSubTopics || [],
  }));

  return (
    <Box>
      <Global
        styles={css`
          body {
            margin: 0;
          }
        `}
      />
      <HeaderComponent />
      <StyledContainer maxWidth="lg">
        <TextPromptCard
          bottomBarIsOpen={subtopics.length > 0}
          subTopics={subtopics}
          handleSearchClick={(text) =>
            dispatch(fetchListOfSubTopicsAction(text))
          }
        />
      </StyledContainer>
    </Box>
  );
};
export default AICarumba;
