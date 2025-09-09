import { Button, FormControl, MenuItem, TextField, Select, InputLabel } from '@mui/material';
import React, { useState } from 'react'
import { Box } from '@mui/material';

const ActivityForm = ({ onActivityAdded }) => {
  // define the initial state of the form
  const [activity, setActivity] = useState({
    type: "RUNNING", duration: '', caloriesBurned: '', 
    additionalMetrics: {}
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //await addActivity(activity); // call the api to save the activity
      onActivityAdded(); // function to notify the parent component that new activity has been added
      setActivity({type: "RUNNING", duration: '', caloriesBurned: ''}); // resetting the form
    } catch (error) {

    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel>Activity Type</InputLabel>
        <Select
            value={activity.type}
            onChange={(e) => setActivity({...activity, type: e.target.value})}>
            <MenuItem value="RUNNING">Running</MenuItem>
            <MenuItem value="WALKING">Walking</MenuItem>
            <MenuItem value="CYCLING">Cycling</MenuItem>
        </Select>
      </FormControl>

      <TextField fullWidth
          label='Duration (minutes)'
          type='number'
          sx={{ mb:2 }}
          value={activity.duration}
          onChange={(e) => setActivity({...activity, duration: e.target.value})}>
      </TextField>

      <TextField fullWidth
          label='Calories Burned'
          type='number'
          sx={{ mb:2 }}
          value={activity.caloriesBurned}
          onChange={(e) => setActivity({...activity, caloriesBurned: e.target.value})}>
      </TextField>

      <Button type='submit' variant='contained'>Add Activity</Button>

    </Box>
  )
}

export default ActivityForm;
