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
import Carousel from "react-material-ui-carousel";
import * as React from "react";

const StyledContainer = styled(Container)`
  margin-top: 20px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
`;

// mobile only version of component above
const StyledContainerMobile = styled(StyledContainer)`
  @media (min-width: 600px) {
    display: none;
  }
`;

// same as above but only visible on desktop
const StyledContainerDesktop = styled(StyledContainer)`
  @media (max-width: 600px) {
    display: none;
  }
`;

// styled image to fit the screen on mobile while maintaining aspect ratio
// on larger screens, the image will be centered and have a max width of 500px
const StyledGeneratedImage = styled.img`
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  display: block;
`;

// carousel is only visible when on mobile, and will center its contents
const StyledCarousel = styled(Carousel)`
  display: none;
  @media (max-width: 600px) {
    display: block;
    width: 100%;
  }
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
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
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
        sx={{
          marginBottom: "10px",
        }}
        label="Number Of Categories"
        variant="standard"
        type="number"
        value={numberOfCategories}
        onChange={(event) =>
          dispatch(setNumberOfCategories(parseInt(event.target.value, 10)))
        }
      />
      {generatedImageUrl && (
        <StyledGeneratedImage src={generatedImageUrl} alt="" />
      )}
      <StyledContainerMobile maxWidth="lg">
        <StyledCarousel navButtonsAlwaysInvisible={true} autoPlay={false}>
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
        </StyledCarousel>
      </StyledContainerMobile>
      <StyledContainerDesktop maxWidth="lg">
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
      </StyledContainerDesktop>
    </Box>
  );
};
export default AICarumba;
