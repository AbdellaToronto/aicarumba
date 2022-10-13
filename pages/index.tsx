import { useDispatch, useSelector } from "react-redux";
import {
  fetchListOfSubTopicsAction,
  generateImageFromPromptsAction,
  setNumberOfCategories,
} from "../store/actions";
import { HeaderComponent } from "../components/header.component";
import { css, Global } from "@emotion/react";
import { TextPromptCard } from "../components/textPromptCard.component";
import { Box, Container, TextField } from "@mui/material";
import styled from "@emotion/styled";
import * as React from "react";

const StyledContainer = styled(Container)`
  margin-top: 20px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const AICarumba = () => {
  const dispatch = useDispatch();

  const generatedImageUrl = useSelector((state: any) => {
    return state.response?.output?.[0];
  });

  const numberOfCategories = useSelector((state: any) => {
    return state.numberOfCategories;
  });

  // get rid of any eventually, lazy ow
  const subtopics = useSelector((state: any) => state.listsOfSubTopics || {});

  return (
    <Box>
      <Global
        styles={css`
          body {
            margin: 0;
          }
        `}
      />
      <HeaderComponent
        onGenerate={() => dispatch(generateImageFromPromptsAction(subtopics))}
      />
      <TextField
        label="Number Of Categories"
        variant="standard"
        type="number"
        value={numberOfCategories}
        onChange={(event) =>
          dispatch(setNumberOfCategories(parseInt(event.target.value, 10)))
        }
      />
      <StyledContainer maxWidth="lg">
        {generatedImageUrl && <img src={generatedImageUrl} alt="" />}

        {Array.from({ length: numberOfCategories }).map((_, index) => (
          <TextPromptCard
            key={index + "category"}
            bottomBarIsOpen={false}
            subTopics={subtopics[index] || []}
            handleSearchClick={(prompt) =>
              dispatch(fetchListOfSubTopicsAction({ prompt, index }))
            }
          />
        ))}
      </StyledContainer>
    </Box>
  );
};
export default AICarumba;
