import React, { useState, useEffect } from 'react';
import Cells from "./cells";
import Navbar from "./navbar";
import Menu from "./menu";

const Queen = () => {
    const [board, setBoard] = useState([]);
    const [number, setNumber] = useState(4);
    const [speed, setSpeed] = useState(490);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        const initializeBoard = () => {
            const initialBoard = getBoard(number);
            setBoard(initialBoard);
        };

        initializeBoard();
    }, [number]);

    const handleSpeedChange = (val) => {
        const newSpeed = (100 - val) * 10;
        setSpeed(newSpeed);
    };

    const handleQueenChange = (newNumber) => {
        setNumber(newNumber);
    };

    const handleClear = () => {
        const clearedBoard = getBoard(number);
        setBoard(clearedBoard);
    };

    const handleStop = () => {
        setIsRunning(false);
    };

    const startAlgo = async () => {
        setIsRunning(true);
        const newBoard = [...board];
        await queensAlgo(newBoard, 0);
        const newBoard2 = turnOffAttack(board, number);
        setBoard(newBoard2);
        setIsRunning(false);
    };

    const queensAlgo = async (board, col) => {
        if (col >= number) {
            return true;
        }

        let newBoard = [...board];
        for (let i = 0; i < number; i++) {
            newBoard = turnOffAttack(newBoard, number);
            const result = getChecked(newBoard, i, col, number);
            newBoard = result[0];
            setBoard(newBoard);
            await sleep(speed);
            if (result[1]) {
                const res = await queensAlgo(newBoard, col + 1);
                if (res === true) {
                    return true;
                }
                newBoard[i][col] = { ...newBoard[i][col], isPresent: true, isCurrent: true };
                setBoard(newBoard);
                await sleep(speed);
                newBoard[i][col] = { ...newBoard[i][col], isPresent: false, isCurrent: false };
                setBoard(newBoard);
            }
            newBoard[i][col] = { ...newBoard[i][col], isPresent: false, isCurrent: false };
            newBoard = turnOffAttack(newBoard, number);
            setBoard(newBoard);
            await sleep(speed);
        }
        return false;
    };

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    const turnOffAttack = (board, N) => {
        const newBoard = [...board];
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                newBoard[i][j] = { ...newBoard[i][j], isChecked: false, isAttacked: false, isCurrent: false };
            }
        }
        return newBoard;
    };

    const getChecked = (board, row, col, N) => {
        const newBoard = board.slice();
        let pos = true;
        // same col
        for( let i = 0;i < N;i++ ){
            if( newBoard[row][i].isPresent ){
                newBoard[row][i] = {...newBoard[row][i],isAttacked:true};
                pos = false;
            } else{
                newBoard[row][i] = {...newBoard[row][i],isChecked:true};
            }
        }
        // same row
        for( let i = 0;i < N;i++ ){
            if( newBoard[i][col].isPresent ){
                newBoard[i][col] = {...newBoard[i][col],isAttacked:true};
                pos = false;
            } else{
                newBoard[i][col] = {...newBoard[i][col],isChecked:true};
            }
        }
        for( let i = row,j = col; i >= 0 && j >= 0; i--, j--){
            if( newBoard[i][j].isPresent ){
                newBoard[i][j] = {...newBoard[i][j],isAttacked:true};
                pos = false;
            } else{
                newBoard[i][j] = {...newBoard[i][j],isChecked:true};
            }
        }
        for( let i = row,j = col; i <N && j >= 0; i++, j--){
            if( newBoard[i][j].isPresent ){
                newBoard[i][j] = {...newBoard[i][j],isAttacked:true};
                pos = false;
            } else{
                newBoard[i][j] = {...newBoard[i][j],isChecked:true};
            }
        }
        for( let i = row,j = col; i <N && j < N; i++, j++){
            if( newBoard[i][j].isPresent ){
                newBoard[i][j] = {...newBoard[i][j],isAttacked:true};
                pos = false;
            } else{
                newBoard[i][j] = {...newBoard[i][j],isChecked:true};
            }
        }
        for( let i = row,j = col; i>=0 && j < N; i--, j++){
            if( newBoard[i][j].isPresent ){
                newBoard[i][j] = {...newBoard[i][j],isAttacked:true};
                pos = false;
            } else{
                newBoard[i][j] = {...newBoard[i][j],isChecked:true};
            }
        }
    
        newBoard[row][col] = {...newBoard[row][col],isPresent:true,isCurrent:true};
    
        return [newBoard,pos];
    };

    const getBoard = (N) => {
        const rows = [];
        for (let i = 0; i < N; i++) {
            const cols = [];
            for (let j = 0; j < N; j++) {
                cols.push(getCell(i, j));
            }
            rows.push(cols);
        }
        return rows;
    };

    const getCell = (row, col) => {
        return {
            row,
            col,
            isPresent: false,
            isChecked: false,
            isAttacked: false,
            isCurrent: false
        };
    };

    return (
        <div>
            <Navbar />
            <Menu
                onSpeedChange={handleSpeedChange}
                onCountChange={handleQueenChange}
                onViusalize={startAlgo}
                disable={isRunning}
                onClear={handleClear}
                onStop={handleStop}
            />
            <div style={{ textAlign: "Center" }}>
                <Cells
                    board={board}
                />
            </div>
        </div>
    );
};

export default Queen;
