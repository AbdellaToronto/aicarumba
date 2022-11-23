import { useDispatch, useSelector } from "react-redux";
import {
  fetchListOfSubTopicsAction,
  generateImageFromPromptsAction,
  setNumberOfCategories,
  updateCategoryListQuery,
  userGuess,
} from "../store/actions";
import { HeaderComponent } from "../components/header.component";
import { css, Global } from "@emotion/react";
import { TextPromptCard } from "../components/textPromptCard.component";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Container, List, ListItem, TextField } from "@mui/material";
import styled from "@emotion/styled";
import * as React from "react";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { CategoryState } from "../store/store";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const StyledContainer = styled(Container)`
  margin-top: 20px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
`;

// mobile only version of component above
const StyledContainerMobile = styled(StyledContainer)`
  flex-grow: 1;
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

// styled List Item to have a rounded, light purple 3px border
// the contents are spaced between
const StyledListItem = styled(ListItem)`
  border-radius: 5px;
  border: 3px solid
    ${({
      loadingstate = CategoryState.DEFAULT,
    }: {
      loadingstate: CategoryState;
    }) => {
      const loadingStateColours = {
        [CategoryState.LOADING]: "#f9f3d9",
        [CategoryState.LOADED]: "#b3ffb3",
        [CategoryState.ERROR]: "#ffb3b3",
        // default is mostly transparent grey, hex with alpha
        [CategoryState.DEFAULT]: "#e6e6e630",
      };
      return (
        loadingStateColours[loadingstate] ||
        loadingStateColours[CategoryState.DEFAULT]
      );
    }};
  margin-bottom: 5px;
  justify-content: space-between;
  align-items: unset;
`;

/**
 * A mini-button that generates a random dark colour (that must be readable on a white background) for the text and the border,
 * @param {children} children - the text to be displayed
 */
const RandomColourButton = ({ children, ...restProps }) => {
  const randomColour = () => {
    const randomHue = Math.floor(Math.random() * 360);
    const randomSaturation = Math.floor(Math.random() * 50) + 50;
    const randomLightness = Math.floor(Math.random() * 50) + 25;
    return `hsl(${randomHue}, ${randomSaturation}%, ${randomLightness}%)`;
  };

  const colour = randomColour();

  return (
    <Box
      sx={{
        border: `2px solid ${colour}`,
        borderRadius: "5px",
        padding: "5px 10px",
        color: colour,
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#e6e6e6",
        },
      }}
      {...restProps}
    >
      {children}
    </Box>
  );
};

/**
 * A component that displays the list of subtopics for a category
 * it has the category title above a row of RandomColourButtons,
 * each pill is a subtopic
 * selecting a subtopic by clicking a pill can be disabled with a prop
 * @param {children} chilren - the category to display
 * @param {boolean} disableSelect - whether to disable selecting a subtopic
 * @param {function} onSelect - the function to call when a subtopic is selected
 * @param {subtopics} subtopics - the list of subtopics to display
 */
const SubtopicPillContainer = ({
  children,
  disableSelect = false,
  onSelect = () => {},
  subtopics,
}: {
  children;
  disableSelect?: boolean;
  onSelect?: (subtopic: string, index: number) => void;
  subtopics: string[];
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <Typography variant="h5">{children}</Typography>
      <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {subtopics.map((subtopic, index) => (
          <RandomColourButton
            key={subtopic}
            onClick={() => !disableSelect && onSelect(subtopic, index)}
          >
            {subtopic}
          </RandomColourButton>
        ))}
      </Box>
    </Box>
  );
};

/**
 * A small component of a plus icon and a minus icon, used to add and remove to a number
 *
 * @param {number} value - the value to be incremented
 * @param {function} setValue - the function that fires when the value is changed
 * @param {label} label - the label to be displayed to the left of the icons
 * @param {sx} sx - the sx prop to be passed to the container
 */
const Incrementer = ({ value, setValue, label, sx = {} }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        ...sx,
      }}
    >
      <Typography variant="body2">{label}</Typography>
      <IconButton
        aria-label="decrement"
        onClick={() => setValue(value - 1)}
        disabled={value === 0}
      >
        <RemoveIcon />
      </IconButton>
      <Typography variant="body2">{value}</Typography>
      <IconButton aria-label="increment" onClick={() => setValue(value + 1)}>
        <AddIcon />
      </IconButton>
    </Box>
  );
};

const AICarumba = () => {
  const dispatch = useDispatch();

  const generatedImageUrl = useSelector((state: any) => {
    return state.response?.output?.[0];
  });

  const answerList = useSelector((state: any) => {
    return state.response?.prompts || [];
  });

  const numberOfCategories = useSelector((state: any) => {
    return state.numberOfCategories;
  });

  // get rid of any eventually, lazy ow
  const subtopics = useSelector((state: any) => state.listsOfSubTopics || {});

  const categoryData = useSelector((state: any) => state.categoryData || {});

  const userGuesses = useSelector((state: any) => state.userGuesses || {});

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
      <Incrementer
        value={numberOfCategories}
        setValue={(value) => dispatch(setNumberOfCategories(value))}
        label="Number of Categories"
        sx={{ justifyContent: "center" }}
      />
      {!!generatedImageUrl && (
        <StyledGeneratedImage src={generatedImageUrl} alt="" />
      )}
      <StyledContainerMobile maxWidth="lg">
        {/* material UI list where each category is a list item with an input inside */}

        {!generatedImageUrl && (
          <List sx={{ width: "100%" }}>
            {Array.from({ length: numberOfCategories }).map((_, index) => (
              <StyledListItem
                loadingstate={categoryData[index]?.state}
                key={index}
              >
                {/* text field without bottom border */}
                <TextField
                  label={`Category ${index + 1}`}
                  variant="standard"
                  onChange={(event) =>
                    dispatch(
                      updateCategoryListQuery({
                        categoryNumber: index,
                        subtopic: event.target.value,
                      })
                    )
                  }
                />
                {/* button with loading spinner */}
                <LoadingButton
                  disabled={!categoryData[index]?.query}
                  variant="contained"
                  loading={categoryData[index]?.state === CategoryState.LOADING}
                  onClick={() => {
                    return dispatch(
                      fetchListOfSubTopicsAction({
                        prompt: categoryData[index]?.query,
                        index,
                      })
                    );
                  }}
                >
                  Generate
                </LoadingButton>
              </StyledListItem>
            ))}
          </List>
        )}
        {/* display the subtopics in a list */}
        {!!generatedImageUrl && (
          <Container sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {Object.keys(subtopics).map((category, index) => (
              <SubtopicPillContainer
                key={category}
                subtopics={subtopics[category]}
                disableSelect={userGuesses[index] !== undefined}
                onSelect={(subtopic) => {
                  dispatch(
                    userGuess({
                      categoryNumber: index,
                      subtopic,
                    })
                  );
                }}
              >
                {categoryData[index]?.query || index}
                {/* if the guess is correct, show a green checkmark next to the category */}
                {userGuesses[index] === answerList[index] && (
                  <CheckCircleIcon sx={{ color: "green", marginLeft: "5px" }} />
                )}
                {/*  if the guess is incorrect, show a red x  */}
                {userGuesses[index] !== answerList[index] &&
                  userGuesses[index] !== undefined && (
                    <CancelIcon sx={{ color: "red", marginLeft: "5px" }} />
                  )}
              </SubtopicPillContainer>
            ))}
          </Container>
        )}
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
