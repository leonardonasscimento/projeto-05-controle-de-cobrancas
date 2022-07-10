import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from 'react';
import ChargesDelete from '../../assets/chargesDelete.svg';
import ChargesEdit from '../../assets/chargesEdit.svg';
import OrganizeIcon from '../../assets/organize-icon.svg';
import useGlobalContext from '../../hooks/useGlobalContext';
import api from '../../services/api';
import ModalDeleteCharge from '../ModalDeleteCharge';
import ModalEditCharge from '../ModalEditCharge';
import './style.css';

export default function TableCharges() {
  const [openModalEditCharges, setOpenModalEditCharges] = useState(false);
  const [openModalDeleteCharges, setOpenModalDeleteCharges] = useState(false);
  const { 
    token, 
    chargesArray, 
    setChargesArray, 
    setCurrentCharge } = useGlobalContext();

  function handleVerifyDataCharge(row) {
    setCurrentCharge(row);
  }

  async function handleLoadCharges() {
    try {
      const response = await api.get("/cobranca", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status > 204) {
        return;
      }

      setChargesArray([...response.data]);
    } catch (error) {
      alert(error.response.data.message);
    }
  }

  useEffect(() => {
    handleLoadCharges();
  });

  return (
    <TableContainer>
      <Table sx={{ minWidth: 280 }} size="medium" aria-label="a dense table">
        <TableHead>
          <TableCell className="title-table">
            <img src={OrganizeIcon} alt="organize" />
            <span>Cliente</span>
          </TableCell>
          <TableCell className="title-table">
            <img src={OrganizeIcon} alt="organize" />
            <span>ID Cob.</span>
          </TableCell>
          <TableCell className="title-table">Valor</TableCell>
          <TableCell className="title-table">Data de venc.</TableCell>
          <TableCell className="title-table">Status</TableCell>
          <TableCell className="title-table">Descrição</TableCell>
          <TableCell className="title-table"></TableCell>
        </TableHead>
        <TableBody>
          {chargesArray.map((row, index) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row" className="table-items">
                {row.cliente}
              </TableCell>
              <TableCell className="table-items">{row.id}</TableCell>
              <TableCell className="table-items">
                {`R$ ${row.valor}`.replace(".", ",")}
              </TableCell>
              <TableCell className="table-items">
                {new Date(row.vencimento).toLocaleDateString()}
              </TableCell>
              <TableCell className="table-items">{row.status}</TableCell>
              <TableCell className="table-items">{row.descricao}</TableCell>
              <TableCell className="table-items">
                <div onClick={() => handleVerifyDataCharge(row)}>
                  <img
                    className="edit-icon"
                    src={ChargesEdit}
                    alt="editar cobranca"
                    onClick={() => setOpenModalEditCharges(true)}
                  />

                  <img
                    src={ChargesDelete}
                    alt="excluir cobranca"
                    onClick={() => setOpenModalDeleteCharges(true)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ModalEditCharge
        open={openModalEditCharges}
        handleClose={() => setOpenModalEditCharges(false)}
      />

      <ModalDeleteCharge
        open={openModalDeleteCharges}
        handleClose={() => setOpenModalDeleteCharges(false)}
      />
    </TableContainer>
  );
}