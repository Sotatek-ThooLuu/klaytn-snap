import React, { useState } from "react";
import { Box, Button, Card, CardContent, CardHeader, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, TextField, Typography } from '@material-ui/core/';
import { KlaytnSnapApi } from "../../types";
import { ExpandMore } from "@material-ui/icons";
import { ExpandCard } from "../common/Expand/ExpandCard";

export interface AccountProps {
    network: string,
    api: KlaytnSnapApi | null
}

export const Account = ({ api, network }: AccountProps) => {
    const [state, setState] = useState({
        rlpEncodedKey: "",
        keyPublic: "",
        accountKeyWeightedMultiSig: "",
        accountKeyRoleBased: "",
    });
    const [message, setMessage] = useState("");
    const [collapsed, setCollapsed] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setState(state => ({ ...state, [e.target.name]: e.target.value }));
    };
    const handleCreateFromRLPEncoding = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (api) {
            const result = await api.createFromRLPEncoding({ network, rlpEncodedKey: state.rlpEncodedKey });
            console.log(result);
            setMessage(JSON.stringify(result));
        }
    };

    return (
        <>
            <ExpandCard title="Account Method">
                <CardContent>
                    <Grid container justifyContent="flex-start" spacing={2}>
                        <Grid item>
                            <Button onClick={handleCreateFromRLPEncoding} color="secondary" variant="contained" size="large">Create With Account Key Fail</Button>
                        </Grid>
                        <Grid item>
                            <Button onClick={handleCreateFromRLPEncoding} color="secondary" variant="contained" size="large">Create With Account Key Legacy</Button>
                        </Grid>
                    </Grid>
                    <Box m="2rem" />
                    <Grid container justifyContent="flex-start"></Grid>
                    <Box m="2rem" />
                    <Grid container>
                        <TextField
                            onChange={handleChange}
                            value={state.rlpEncodedKey}
                            name="rlpEncodedKey"
                            size="medium"
                            fullWidth
                            label="RLPEncoding"
                            variant="outlined"
                        />
                    </Grid>
                    <Box m="0.5rem" />
                    <Grid container justifyContent="flex-end">
                        <Button onClick={handleCreateFromRLPEncoding} color="secondary" variant="contained" size="large">Create From RLP Encoding</Button>
                    </Grid>
                    <Box m="2rem" />
                    <Grid container>
                        <TextField
                            onChange={handleChange}
                            value={state.keyPublic}
                            name="keyPublic"
                            size="medium"
                            fullWidth
                            label="Key Public"
                            variant="outlined"
                        />
                    </Grid>
                    <Box m="0.5rem" />
                    <Grid container justifyContent="flex-end">
                        <Button onClick={handleCreateFromRLPEncoding} color="secondary" variant="contained" size="large">Create With Account Key Public</Button>
                    </Grid>
                    <Box m="2rem" />
                    <Grid container>
                        <TextField
                            onChange={handleChange}
                            value={state.accountKeyWeightedMultiSig}
                            name="accountKeyWeightedMultiSig"
                            size="medium"
                            fullWidth
                            label="Account Key Weighted MultiSig"
                            variant="outlined"
                        />
                    </Grid>
                    <Box m="0.5rem" />
                    <Grid container justifyContent="flex-end">
                        <Button onClick={handleCreateFromRLPEncoding} color="secondary" variant="contained" size="large">Create With Account Key Weighted MultiSig</Button>
                    </Grid>
                    <Box m="2rem" />
                    <Grid container>
                        <TextField
                            onChange={handleChange}
                            value={state.accountKeyRoleBased}
                            name="accountKeyRoleBased"
                            size="medium"
                            fullWidth
                            label="Account Key Role Based"
                            variant="outlined"
                        />
                    </Grid>
                    <Box m="0.5rem" />
                    <Grid container justifyContent="flex-end">
                        <Button onClick={handleCreateFromRLPEncoding} color="secondary" variant="contained" size="large">Create With Account Key Role Based</Button>
                    </Grid>
                </CardContent>
            </ExpandCard>
            <Dialog
                open={!!message}
                onClose={() => setMessage("")}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Account Method Result"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This is message of actions:<br />
                        <Typography style={{ wordWrap: "break-word" }}>{message}</Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setMessage("")} color="primary" autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
};
