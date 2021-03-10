import React from 'react'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TablePagination from '@material-ui/core/TablePagination'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'

const AuditTrail = (props) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    React.useEffect(() => {
        if(props.auditTrail.length <= 0) {
            props.getAuditTrail()
        }
    });

    const columns = [
        { id: 'user', label: 'user', minWidth: 50},
        { id: 'action', label: 'action', minWidth: 75},
        { id: 'item-name', label: 'item name', minWidth: 280},
        {
          id: 'time',
          label: 'time',
          minWidth: 200
        },{
            id:'details',
            label:'details',
            minWidth: 50
        }
      ]

      const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
      }
    

    const renderWishList = () => {
        return (
            <Paper>
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
                {(props.auditTrail).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                    return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={index} >
                            <TableCell>
                                {row.username}
                            </TableCell>
                            <TableCell>
                                {row.action}
                            </TableCell>
                            <TableCell>
                                <img alt={row.name} src={`/images/${row.img_name}`}/>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <a href={`https://classic.wowhead.com/item=${row.item_id}`} target='_blank' rel='noreferrer'>{row.name}</a>
                            </TableCell> 
                            <TableCell>
                                {(new Date(row.time_stamp)).toTimeString()}
                            </TableCell>
                            <TableCell>
                                
                                {row.details == null ? '': JSON.stringify(row.details.toString('utf8'))}
                            </TableCell>
                        </TableRow>
                        )
                    })}
                </TableBody>
                </Table>
            </TableContainer> 
            <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={props.auditTrail.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
        />
    </Paper>
        )
    }

    return(
        <span>
            <Box component="span" m={1}>
            <h3>Audit Trail</h3>
                <Paper>
                 {renderWishList()}
                </Paper>
            </Box>
        </span>
    )
}

export default AuditTrail