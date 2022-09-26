import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ImageSearch from "@mui/icons-material/ImageSearch";
import { Divider, Stack, TextField } from "@mui/material";
import { useEffect } from "react";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const TextPromptCard: React.FC<{
  handleSearchClick: (cardInputText: string) => void;
  subTopics: string[];
  bottomBarIsOpen: boolean;
}> = ({ handleSearchClick, subTopics = [], bottomBarIsOpen = false }) => {
  const [expanded, setExpanded] = React.useState(bottomBarIsOpen);
  const [topic, setTopic] = React.useState("");

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    setExpanded(bottomBarIsOpen);
  }, [bottomBarIsOpen]);

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        title="Test Prompt Card"
        subheader="Put in a topic and should get a result as a list of AI generated subtopics"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          The goal with this is to test the process of dynamically generated
          topic generation!
        </Typography>
        <TextField
          id="standard-basic"
          label="General Topic"
          variant="standard"
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
        />
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          aria-label="generate sub topics"
          onClick={() => handleSearchClick(topic)}
        >
          <ImageSearch />
        </IconButton>

        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Stack
            divider={<Divider orientation="horizontal" flexItem />}
            spacing={2}
          >
            {subTopics.map((subtopic) => (
              <Typography key={subtopic} variant="h5">
                {subtopic}
              </Typography>
            ))}
          </Stack>
        </CardContent>
      </Collapse>
    </Card>
  );
};
