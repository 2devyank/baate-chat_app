import { Box, CircularProgress } from '@mui/material'


function Loader() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  )
}

export default Loader