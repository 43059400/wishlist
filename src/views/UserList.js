import React from 'react'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'

const UserList = (props) => {
    React.useEffect(() => {
        if(props.userList.length <= 0) {
            props.getUserList()
        }
    });

    const columns = [
        { id: 'user', label: 'user', minWidth: 50},
      ]


    const renderUserList = () => {
        return (
            <TableContainer className={''}>
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
                {(props.userList).map((row) => {
                    return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id} >
                            <TableCell>
                                {row.username}#{row.discriminator}
                            </TableCell>
                        </TableRow>
                        )
                    })}
                </TableBody>
                </Table>
            </TableContainer> 
        )
    }

    return(
        <span>
            <Box component="span" m={1}>
            <h3>User List</h3>
                <Paper>
                 {renderUserList()}
                </Paper>
            </Box>
        </span>
    )
}

export default UserList