"use client"

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import IconButton from '@mui/material/IconButton';

export const ButtonItem = (props: any) => {

    const { item, handleIncrease, handleDecrease, handleDelete } = props;
    
    return (
        <>
            <div className="flex items-center justify-between gap-[5px] sm:gap-[10px] md:gap-[30px] md:ml-[10px]">
                <div className="flex items-center gap-[5px] md:gap-[10px]">
                    {
                        item.quantity === 1 ?
                            <IconButton disabled>
                                <RemoveIcon />
                            </IconButton> :
                            <IconButton
                                onClick={() => {handleDecrease(item.id)}}
                            >
                                <RemoveIcon />
                            </IconButton>
                    }
                    <div className="lg:text-[16px] text-[14px]">
                        {
                            item.quantity
                        }
                    </div>
                    <IconButton
                        onClick={() => {handleIncrease(item.id)}}
                    >
                        <AddIcon />
                    </IconButton>
                </div>
                <div className="ml-[10px]">
                    <IconButton aria-label="delete" size="medium"
                        sx={{
                            "&:hover": {
                                color: "red"
                            }
                        }}
                        onClick={() => {handleDelete(item.id)}}
                    >
                        <DeleteOutlineIcon />
                    </IconButton>
                </div>
            </div>
        </>
    );
}