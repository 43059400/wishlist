import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& > * + *': {
        marginLeft: theme.spacing(2),
      },
    },
  }));
const Loading = (props) => {
    const classes = useStyles();
    return (
      <div className={classes.root}>
                    <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '100vh' }}
            >

            <Grid item xs={3}>
                <Typography>Loading...</Typography><br /><br />
            <CircularProgress />
            </Grid>   

            </Grid> 
      </div>
    );
}

export default Loading