import React from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

// Sample data for uploaded reels
const sampleReels = [
  {
    id: 1,
    title: "Reel 1",
    description: "A short description of Reel 1.",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnail: "https://via.placeholder.com/300x180",
  },
  {
    id: 2,
    title: "Reel 2",
    description: "A short description of Reel 2.",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    thumbnail: "https://via.placeholder.com/300x180",
  },
  {
    id: 3,
    title: "Reel 3",
    description: "A short description of Reel 3.",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnail: "https://via.placeholder.com/300x180",
  },
  // Add more reels as needed
];

const AllReelsPage = () => {
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 100px)",
        padding: 3,
        backgroundColor: "#f4f4f4",
      }}
    >
      {/* Page Header */}
      <Typography
        variant="h4"
        fontWeight="600"
        sx={{ mb: 4, textAlign: "center", color: "#FF3D00" }}
      >
        All Biz Reels
      </Typography>

      {/* Reel Grid */}
      <Grid container spacing={3}>
        {sampleReels.map((reel) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={reel.id}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 2,
                backgroundColor: "#fff",
                "&:hover": { boxShadow: 4 },
              }}
            >
              {/* Thumbnail */}
              <CardMedia
                component="img"
                height="180"
                image={reel.thumbnail}
                alt={reel.title}
                sx={{
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
              />

              {/* Content */}
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight="600"
                  color="#FF3D00"
                  gutterBottom
                >
                  {reel.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {reel.description}
                </Typography>
              </CardContent>

              {/* Actions */}
              <CardActions
                sx={{
                  justifyContent: "space-between",
                  px: 2,
                  pb: 2,
                }}
              >
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  startIcon={<PlayCircleOutlineIcon />}
                  href={reel.videoUrl}
                  target="_blank"
                  sx={{ textTransform: "none" }}
                >
                  Play
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  sx={{
                    textTransform: "none",
                    color: "#333",
                    borderColor: "#ccc",
                    "&:hover": { backgroundColor: "#f4f4f4" },
                  }}
                >
                  Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AllReelsPage;
