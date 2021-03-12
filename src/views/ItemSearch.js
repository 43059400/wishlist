import React, {useEffect} from 'react'

import SearchIcon from '@material-ui/icons/Search'
import InputBase from '@material-ui/core/InputBase'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import Button from '@material-ui/core/Button'

import { fade, makeStyles } from '@material-ui/core/styles'

import TrieSearch from 'trie-search'

const columns = [
    { id: 'id', label: 'ID', minWidth: 50},
    { id: 'reserve', label: 'reserve', minWidth: 170},
    { id: 'npc', label: 'npc', minWidth: 100},
    {
      id: 'type',
      label: 'type',
      minWidth: 50,
    },
    {
      id: 'slot',
      label: 'slot',
      minWidth: 50,
    },
    {
      id: 'zone',
      label: 'zone',
      minWidth: 170
    },
    {
        id: 'button',
        label: '',
        minWidth: 50
      },
  ];

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
        display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: 'auto',
        [theme.breakpoints.up('md')]: {
        width: '20ch',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
        display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
        display: 'none',
        },
    },
    rowSelected: {
        backgroundColor: 'red'
    }
}))

const ItemSearch = (props) => {
    const classes = useStyles()

    const [searchItems, setSearchItems] = React.useState([])
    const [timeout, setTimeout] = React.useState(0)
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    useEffect(() => {
        if(props.items.length <= 0) {
            props.getItems()
            props.socket.emit('get_wish_list', props.user)
        }
    });

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    const itemSearch = (e) => {
        let searchText = e.target.value // this is the search text
        if(timeout) clearTimeout(timeout)
         setTimeout(() => {
            let ts = new TrieSearch('name')
            ts.addAll(props.items)
            setSearchItems(ts.get(searchText))
            if(searchText === '') {
                setSearchItems(props.items)
            }
            props.socket.emit('get_wish_list', props.user)
        }, 300)
    }
    const fixAlias = () => {
        let fixedAlias = {
            alias_id: props.alias.hasOwnProperty('id') ?  props.alias.id : props.alias.user_id
        }
        return fixedAlias
    }

    const insertWish = (item) => {
       props.socket.emit('insert_wish', props.user, item, fixAlias())
    }

    const deleteWish = (item) => {
        let selected = ''
        props.wishes.forEach((wish) => {
            if(wish.item_id === item.id) {
                props.allAlias.forEach((myAlias) => {
                    if(myAlias.alias_id === wish.alias_id) {
                        selected = myAlias
                    }
                })
            } 
        })
        item.item_id = item.id
        props.socket.emit('delete_wish', props.user, item, selected)
    }

    const renderHighlight = (item) => {
        let selected = false
        props.wishes.forEach((wish) => {
            if(wish.item_id === item.id) {
                selected = true 
            } 
        })

        return selected
    }
    const renderAlias = (item) => {

        let selected = ''
        props.wishes.forEach((wish) => {
            if(wish.item_id === item.id) {
                props.allAlias.forEach((myAlias) => {
                    if(myAlias.alias_id === wish.alias_id) {
                        selected = myAlias.name
                    }
                })
            } 
        })

        return selected
    }

    const handleWish = (item) => {
        renderHighlight(item) ? deleteWish(item) : insertWish(item)
    }

    return(
        <span>
            <h3>Item Search</h3>
            <Paper className={classes.root}>
                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <SearchIcon />
                    </div>
                    <InputBase
                    onChange={e => itemSearch(e)}
                    placeholder="Search…"
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    inputProps={{ 'aria-label': 'search' }}
                    />
                </div>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                        {columns.map((column) => (
                            <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                            >
                            {column.label}
                            </TableCell>
                        ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(searchItems.length > 0 ? searchItems : props.items).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                        return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={row.id} selected={renderHighlight(row)} >
                                <TableCell>
                                    {row.id}
                                </TableCell>
                                <TableCell>
                                    {renderAlias(row)}
                                </TableCell>
                                <TableCell>
                                    <img alt={row.name} src={`/images/${row.img_name}`}/>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <a href={`https://classic.wowhead.com/item=${row.id}`} target='_blank' rel='noreferrer'>{row.name}</a>
                                </TableCell> 
                                <TableCell>
                                    <a href={`https://classic.wowhead.com/npc=${row.npcs_id}`} target='_blank' rel='noreferrer'>{row.npc}</a>
                                </TableCell>
                                <TableCell>
                                    {row.type}
                                </TableCell>
                                <TableCell>
                                    {row.slot}
                                </TableCell>
                                <TableCell>
                                    <a href={`https://classic.wowhead.com/zone=${row.zone_id}`} target='_blank' rel='noreferrer'>{row.zone}</a>
                                </TableCell>
                                <TableCell>
                                    <Button onClick={() => { handleWish(row)}} variant='contained' color={renderHighlight(row) ? 'secondary': 'primary'}>{renderHighlight(row) ? 'REMOVE' : 'ADD'}</Button>
                                </TableCell>
                            </TableRow>
                        );
                        })}
                    </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={searchItems.length > 0 ? searchItems.length : props.items.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
        </span>
    )
}

export default ItemSearch