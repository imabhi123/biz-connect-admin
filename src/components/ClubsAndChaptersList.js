import React from 'react';
import {
    Box,
    Typography,
    Container,
    Grid,
    Paper,
    Avatar
} from '@mui/material';

const ClubsAndChaptersList = () => {
    // Fake data
    const data = [
        {
            chapterName: "Tech Enthusiasts",
            clubName: "AI Club",
            location: "San Francisco",
            incharge: "John Doe",
            contact: "123-456-7890",
            imagePreview: "/api/placeholder/300/300",
        },
        {
            chapterName: "Creative Minds",
            clubName: "Art Club",
            location: "New York",
            incharge: "Jane Smith",
            contact: "987-654-3210",
            imagePreview: "/api/placeholder/300/300",
        },
        {
            chapterName: "Sports Legends",
            clubName: "Athletics Club",
            location: "Chicago",
            incharge: "Bob Johnson",
            contact: "555-555-5555",
            imagePreview: "/api/placeholder/300/300",
        },
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: '',
                display: 'flex',
                justifyContent: 'center',
                alignItems: '',
                py: 6,
            }}
        >
            <Container maxWidth="">
                <Typography
                    variant="h3"
                    fontWeight="bold"
                    sx={{
                        mb: 4,
                        textAlign: 'center',
                        color: 'black',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    }}
                >
                    Clubs & Chapters
                </Typography>

                <Grid container spacing={0} sx={{ gap: '20px' }} >
                    {data.map((item, index) => (
                        <Grid item xs={5} key={index}>
                            <Paper
                                elevation={8}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderRadius: 6,
                                    overflow: 'hidden',
                                    transform: 'scale(1)',
                                    transition: 'transform 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                    },
                                    boxShadow: '0 8px 10px rgba(0,0,0,0.3)',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: { xs: '100%', sm: '30%' },
                                        background: 'linear-gradient(to top, #feb47b, #ff7e5f)',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        p: 2,
                                        borderRadius: '0px 10px 10px 0px'
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            border: '4px solid white',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                        }}
                                        src={item.imagePreview}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        p: 3,
                                        width: { xs: '100%', sm: '70%' },
                                        backgroundColor: 'white',
                                    }}
                                >
                                    <Typography
                                        variant="h5"
                                        fontWeight="bold"
                                        sx={{ mb: 1, color: '#333' }}
                                    >
                                        {item.clubName}
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ color: '#666', mb: 0.5 }}>
                                        <strong>Chapter:</strong> {item.chapterName}
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ color: '#666', mb: 0.5 }}>
                                        <strong>Location:</strong> {item.location}
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ color: '#666', mb: 0.5 }}>
                                        <strong>Incharge:</strong> {item.incharge}
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ color: '#666' }}>
                                        <strong>Contact:</strong> {item.contact}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default ClubsAndChaptersList;
