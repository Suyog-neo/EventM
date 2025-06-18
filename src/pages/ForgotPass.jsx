import { Box, Typography } from '@mui/material'
import React from 'react'

function ForgotPass() {
    return (
        <Box sx={{
            height:'90vh',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            backgroundColor:'#caf0f8'
        }}>
            <Box sx={{
                backgroundColor:'white',
                height:'10vh',
                padding:2
            }}>
            <Typography>Forgot Password</Typography>

            </Box>
        </Box>
    )

}

export default ForgotPass