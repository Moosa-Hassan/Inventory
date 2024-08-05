'use client'
import React, { useState , useEffect} from 'react'; // imports react components
import { Box, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, ButtonGroup, Checkbox } from "@mui/material"; //imports all necessary components from material ui
import { firestore, collection, addDoc, getDocs, deleteDoc, doc } from './firebase'; 

// Function to create initial data
function createData(name, description, quantity) {
  return { name, description, quantity };
}

// Add Component
const Add = ({ open, handleClose, formData, handleInputChange, handleAddClick }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Item</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Item Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleInputChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleAddClick} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Home Component
export default function Home() {
  // State to manage dialog visibility
  const [open, setOpen] = useState(false);
  // State to manage form inputs
  const [formData, setFormData] = useState({ name: '', description: '', quantity: '' });
  // State to manage list of items
  const [items, setItems] = useState([]);
  // State to manage selected items for removal
  const [selectedItems, setSelectedItems] = useState([]);
  // fire base configuration
  const itemsCollectionRef = collection(firestore, 'items');

  // Fetch data from Firestore on component mount
  useEffect(() => {
    const fetchItems = async () => {
      const data = await getDocs(itemsCollectionRef);
      setItems(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };

    fetchItems();
  }, []);

  // Handle dialog open
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Handle dialog close
  const handleClose = () => {
    setOpen(false);
  };

  // Handle input change for form inputs
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle adding item to table
  const handleAddClick = async () => {
    if (formData.name.trim() && formData.description.trim() && formData.quantity.trim()) {
      try {
        const docRef = await addDoc(itemsCollectionRef, formData);
        setItems([...items, { ...formData, id: docRef.id }]);
        setFormData({ name: '', description: '', quantity: '' }); // Clear the form
        handleClose(); // Close the dialog
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  };
  //to remove selected items
  const handleRemoveClick = async () => {
    try {
      await Promise.all(selectedItems.map(id => deleteDoc(doc(firestore, 'items', id))));
      setItems(items.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]); // Clear selection after removal
    } catch (e) {
      console.error("Error removing documents: ", e);
    }
  };

  // Handle row selection
  const handleSelectRow = (id) => {
    setSelectedItems(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(itemId => itemId !== id)
        : [...prevSelected, id]
    );
  };

  

  return (
    
    <Box
      height="100vh"
      width="100vw"
      bgcolor="#d1d6aa"
      display="flex"
      flexDirection="column"
      gap={10}
    >
      <Box
        height="15vh"
        width="100vw"
        bgcolor="#687236"
        textAlign="center"
        fontSize="40px"
        fontFamily="Roboto"
        padding="16px"
      >
        Inventory Manager
      </Box>

      <Box
        width="100vw"
        height="70vh"
        bgcolor="#d1d6aa"
        display="flex"
        flexDirection="column"
        padding="15px"
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          marginBottom="20px"
        >
          <ButtonGroup variant="contained">
            <Button color="success" size="large" onClick={handleClickOpen}>Add</Button>
            <Button color="secondary" size="large" onClick={handleRemoveClick}>Remove</Button>
          </ButtonGroup>
        </Box>

        <Add
          open={open}
          handleClose={handleClose}
          formData={formData}
          handleInputChange={handleInputChange}
          handleAddClick={handleAddClick}
        />

        <TableContainer component={Paper} style={{ maxHeight: 250 }}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Select</TableCell>
                <TableCell>Item</TableCell>
                <TableCell align="center">Description</TableCell>
                <TableCell align="right">Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectRow(item.id)}
                    />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {item.name}
                  </TableCell>
                  <TableCell align="center">{item.description}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
