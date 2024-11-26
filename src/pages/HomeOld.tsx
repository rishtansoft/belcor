import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import RobotIcon from '../assets/robot.svg';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

type BoxType = {
  x: number;
  y: number;
};

type CommandHistory = {
  original: string;
  optimized: string;
  timestamp: string;
};

interface State extends SnackbarOrigin {
  open: boolean;
}

const RobotGame: React.FC = () => {
  const gridSize = 10;
  const [robotX, setRobotX] = useState(0);
  const [robotY, setRobotY] = useState(0);
  const [boxes, setBoxes] = useState<BoxType[]>([
    { x: 3, y: 1 },
    { x: 1, y: 2 },
    { x: 2, y: 3 },
    { x: 6, y: 4 },
    { x: 1, y: 5 },
    { x: 2, y: 6 },
    { x: 4, y: 7 },
  ]);
  const [boxPicked, setBoxPicked] = useState(false);
  const [pickedBoxIndex, setPickedBoxIndex] = useState(-1);
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<CommandHistory[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const [state, setState] = React.useState<State>({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal, open } = state;

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const optimizeCommand = (command: string) =>
    command.replace(/(.)\1+/g, (match, p1) => match.length + p1);

  const executeCommands = () => {
    const commands = command.toUpperCase();
    const optimized = optimizeCommand(commands);
    const timestamp = new Date().toLocaleString();

    setCommandHistory([
      ...commandHistory,
      { original: commands, optimized, timestamp },
    ]);

    let currentX = robotX;
    let currentY = robotY;
    let currentBoxes = [...boxes];
    let isPicking = boxPicked;
    let currentBoxIndex = pickedBoxIndex;

    const executeNextCommand = (index: number) => {
      if (index >= commands.length) {
        setCommand('');
        return;
      }

      const cmd = commands[index];
      setIsAnimating(true);

      if (cmd === 'R' && currentX < gridSize - 1) currentX++;
      else if (cmd === 'L' && currentX > 0) currentX--;
      else if (cmd === 'T' && currentY > 0) currentY--;
      else if (cmd === 'B' && currentY < gridSize - 1) currentY++;
      else if (cmd === 'P') {
        if (!isPicking) {
          const boxIndex = currentBoxes.findIndex(
            (box) => box.x === currentX && box.y === currentY
          );
          if (boxIndex !== -1) {
            isPicking = true;
            currentBoxIndex = boxIndex;
          }
        }
      } else if (cmd === 'D') {
        if (isPicking && currentBoxIndex !== -1) {
          currentBoxes[currentBoxIndex] = { x: currentX, y: currentY };
          isPicking = false;
          currentBoxIndex = -1;
        }
      }

      setRobotX(currentX);
      setRobotY(currentY);
      setBoxes(currentBoxes);
      setBoxPicked(isPicking);
      setPickedBoxIndex(currentBoxIndex);

      setTimeout(() => {
        setIsAnimating(false);
        executeNextCommand(index + 1);
        console.log(127);
        handleClick({ vertical: 'top', horizontal: 'right' });
      }, 300);
    };

    executeNextCommand(0);
  };

  const gridCells = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const isRobotHere = robotX === x && robotY === y;
      const isBoxHere = boxes.some((box, index) => {
        if (box.x === x && box.y === y) {
          return boxPicked ? pickedBoxIndex !== index : true;
        }
        return false;
      });

      gridCells.push(
        <Box
          key={`${x}-${y}`}
          sx={{
            width: 40,
            height: 40,
            border: '1px solid #ccc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
          }}
        >
          {isRobotHere && <img src={RobotIcon} alt='Robot' width={20} />}
          {isBoxHere && (
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                backgroundColor: boxPicked && isRobotHere ? 'black' : 'orange',
                transform: isAnimating ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.3s',
              }}
            />
          )}
        </Box>
      );
    }
  }

  const handleChangeCommand = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const allowedChars = /^[LRBTDP]*$/i;

    if (allowedChars.test(value)) {
      setCommand(value.toUpperCase());
    }
  };

  const handleClick = (newState: SnackbarOrigin) => () => {
    console.log(187, newState);
    
    setState({ ...newState, open: true });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Box sx={{ p: 3, display: 'flex', gap: '30px' }}>
      <Box sx={{ width: '30%' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridSize}, 40px)`,
            gap: 1,
            backgroundColor: '#ccc',
            p: 1,
          }}
        >
          {gridCells}
        </Box>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            value={command}
            onChange={handleChangeCommand}
            placeholder='Enter commands (e.g., RRBBPDD)'
            label='Commands'
          />
          <Button
            variant='contained'
            color='primary'
            onClick={executeCommands}
            disabled={isAnimating}
          >
            Execute
          </Button>
        </Box>

        <Typography sx={{ mt: 2 }}>
          Commands: R (Right), L (Left), T (Up), B (Down), P (Pick), D (Drop)
        </Typography>
      </Box>

      <Box sx={{ mt: 3, width: '70%' }}>
        <Typography variant='h6'>Command History</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Original</TableCell>
                <TableCell>Optimized</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {commandHistory.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{entry.original}</TableCell>
                  <TableCell>{entry.optimized}</TableCell>
                  <TableCell>{entry.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        message="I love snacks"
        key={vertical + horizontal}
      />
    </Box>
  );
};

export default RobotGame;
