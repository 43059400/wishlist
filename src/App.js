import React, {useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'

import io from 'socket.io-client'

import ItemSearch from './views/ItemSearch'
import WishList from './views/WishList'
//import AuditTrail from './views/AuditTrail'
import Reserves from './views/Reserves'
//import Profile from './views/Profile'

import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar'
import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Slide from '@material-ui/core/Slide'
import CssBaseline from '@material-ui/core/CssBaseline'
//import Popover from '@material-ui/core/Popover'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Grid from '@material-ui/core/Grid'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'

import './App.css'
import UserList from './views/UserList'
import { TextField } from '@material-ui/core'

const ENDPOINT = 'https://tegritydatabase.com'
const CLIENT_ID = '769370226835193876'
const REDIRECT_URI = encodeURIComponent('https://tegritydatabase.com/api/discord/callback')
const socket = io(ENDPOINT)
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    links: {
      color: 'white'
    }
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  menuButton: {
    marginRight: theme.spacing(2),
    links: {
      color: 'white'
    }
  },
  title: {
    flexGrow: 1,
  },
}))

function HideOnScroll(props) {
  const { children, window } = props
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined })

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
}

function App(props) {
  const classes = useStyles()
  const [response, setResponse] = React.useState((new Date()).toString())
  const [user, setUser] = React.useState({
    id:0,
    login:0
  })

  const [items, setItems] = React.useState([])
  const [wishes, setWishes] = React.useState([])
  const [alias, setAlias] = React.useState([])
  const [allAlias, setAllAlias] = React.useState([])
  const [selectedAlias, setSelectedAlias] = React.useState(0)
  //const [auditTrail, setAuditTrail] = React.useState([])
  const [usersReserves, setUsersReserves] = React.useState([])
  const [userList, setUserList] = React.useState([])
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [modelOpen, setModelOpen] = React.useState(false)
  const [aliasField, setAliasField] = React.useState('')

  useEffect(() => {
    let queryString = window.location.search
    let urlParams = new URLSearchParams(queryString)
    let id = urlParams.get('id')

    if(id) {
      document.cookie = `id=${id}`
      window.location.replace("https://www.tegritygaming.com");
    } 

    if(parseInt(document.cookie.split('=')[1]) !== undefined) {
      setUser(
        {
          id: document.cookie.split('=')[1] === undefined ?  0 : document.cookie.split('=')[1],
          login: 0
      })
    } 

    socket.on('FromAPI', data => {
      setResponse(new Date(Date.parse(data)).toString())
    })
  }, [])

  useEffect(() => {
    if(user.login === 0 && user.id !== 0) {
      socket.emit('getUserData', user)
    }
  }, [user])

  socket.on('user', (userData) => {
    setUser({
      id: userData.id,
      username: userData.username,
      discriminator: userData.discriminator,
      avatar: userData.avatar,
      admin: userData.admin ,
      login: 1
    })
    socket.emit('get_user_alias_list', userData)
    socket.emit('get_all_alias', userData)
  })

  //socket.on('update_audit_trail', (auditTrailData) => {
   // setAuditTrail(auditTrailData)
 // })

  socket.on('update_reserves', (reservesData) => {
    setUsersReserves(reservesData)
  })

  socket.on('update_alias_list', (aliasdata) => {
    setAlias(aliasdata)
    setSelectedAlias(0)

  })

  socket.on('items', (items) => {
    setItems(items)
  })

  socket.on('update_wishes', (wishes) => {
    setWishes(wishes)
  })

  socket.on('update_user_list', (users) => {
    setUserList(users)
  })

  socket.on('update_all_alias', (updated_alias_list) => {
      setAllAlias(updated_alias_list)
  })

  const logOut = (e) => {
    let addExpire = 'expires=Thu, 18 Dec 2013 12:00:00 UTC path=/'
    document.cookie = `id=0;${addExpire}`
    setUser(
      {
        id: document.cookie.split('=')[1] === undefined ?  0 : document.cookie.split('=')[1],
        login: 0
    })
  }

  const handleModelOpen = () => {
    setModelOpen(true);
  }

  const handleModelClose = () => {
    setModelOpen(false);
  }

  //const getAuditTrail = () => {
    //socket.emit('get_audit_trail')
  //}

  const getReserves = () => {
    socket.emit('get_reserves')
  }

  const getUserList = () => {
    socket.emit('get_user_list')
  }

  const getWishes = () => {
    socket.emit('get_wish_list', user)
  }

  const getItems = () => {
    socket.emit('getItems', user)
  }

  const changeSelectedAlias = (e) => {
    setSelectedAlias(e.target.value)
  }

  const handleAliasChange = (e) => {
    setAliasField(e.target.value)
  }

  const handleAliasAdd = () => {
    setModelOpen(false)
    socket.emit('addAlias', user, aliasField)
    setAliasField('')
  }

  const aliasMenu = () => {
    return (
      <div>
        <FormControl m={1}>
          <Select
            labelId="alias"
            id="alias"
            value={selectedAlias}
            onChange={changeSelectedAlias}
            label="Alias"
          >
            <MenuItem value="" disabled>
            </MenuItem>
              {alias.map((data, index) => {
                return <MenuItem value={index} key={index}>{data.name}</MenuItem>
              })
            }
          </Select>
        </FormControl>
        <Button onClick={handleModelOpen}>ADD</Button>
      </div>
    )
  }

  const displayDashboard = () => {
    if(user.login === 1) {    
      return (
          <Router>
            <CssBaseline />
            <AppBar position="static">
                  <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              anchorEl={anchorEl}
              className={classes.modal}
              open={modelOpen}
              onClose={handleModelClose}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={modelOpen}>
                <div className={classes.paper}>
                  <h2 id="transition-modal-title">Add Character Alias</h2>
                  <p id="transition-modal-description">
                  <TextField id="outlined-basic" label="Character Name" variant="outlined" defaultValue={aliasField} value={aliasField} onChange={handleAliasChange} />
                  <br />
                  <Button onClick={handleAliasAdd}>ADD</Button>
                  <Button onClick={handleModelClose}>CLOSE</Button>
                  </p>
                </div>
              </Fade>
            </Modal>
              <Toolbar>
                <Typography edge="start" variant="h6" color="inherit" className={classes.title}>
                <Grid container spacing={0}>
                  <Grid item xs={12}>
                  ({user.username}#{user.discriminator})&nbsp;Tegrity Beta <br />
                    </Grid>
                  </Grid>
                </Typography>
                <Typography className={classes.menuButton}>
                {(user.login===1) ? aliasMenu() : '<div></div>'}
                </Typography>
                <Typography className={classes.menuButton}>
                  <Link to='/item-search' onClick={getItems} >Item Search</Link>
                </Typography>
                <Typography className={classes.menuButton}>
                  <Link to='/wish-list' onClick={getWishes} >My Wish List</Link>
                </Typography>

                <Typography className={classes.menuButton}>
                  <Link to='/reserves'>Reserves</Link>
                </Typography>
                <Typography className={classes.menuButton}>
                  <Link to='/user-list'>User List</Link>
                </Typography>
                <Typography className={classes.menuButton}>
                  <Button color="inherit" onClick={logOut} href='https://www.tegritygaming.com'>Logout</Button>
                </Typography>
              </Toolbar>
            </AppBar>
            <Toolbar />
            <Container>
              <Box>
                <Switch>
                  <Route path='/wish-list'>
                    <WishList items={items} socket={socket} user={user} wishes={wishes} setWishes={setWishes}  getWishes={getWishes} alias={alias} allAlias={allAlias}/>
                  </Route>
                  <Route path='/reserves'>
                  <Reserves usersReserves={usersReserves} getReserves={getReserves} allAlias={allAlias}/>
                  </Route>
                  <Route path='/item-search'>
                    <ItemSearch items={items} socket={socket} user={user}  wishes={wishes} setWishes={setWishes} getItems={getItems} alias={alias[selectedAlias]} allAlias={allAlias}/>
                  </Route>
                  <Route path='/user-list'>
                    <UserList userList={userList} getUserList={getUserList} /> 
                  </Route>
                  <Route path='/'>
                    <ItemSearch items={items} socket={socket} user={user}  wishes={wishes} setWishes={setWishes} getItems={getItems} alias={alias[selectedAlias]} allAlias={allAlias} />
                  </Route>
                </Switch>
              </Box>
            </Container>
          </Router>
      )
    }
  }

  const displayLogin = () => {
    if(user.login === 0) {
      return (
        <div className='App' >
          <header className='App-header' style={{backgroundImage: `url(/images/tegrity.jpg`}}>
          <span>
            {response}
            <br />
            <h1>Tegrity</h1>
            <Button variant='contained' color='primary' href={`https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=identify`}>Login</Button>
          </span>
          </header>
        </div>
      )
    }
  }

  return (
    <div className='root'>
        {displayLogin()}
        {displayDashboard()}
    </div>
  )
}

export default App
