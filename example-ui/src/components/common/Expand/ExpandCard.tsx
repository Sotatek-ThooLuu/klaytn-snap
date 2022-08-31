import React, { useState } from "react";
import { Card, CardHeader, CardProps, Collapse, Grid } from '@material-ui/core/';
import { ExpandMore, SvgIconComponent } from "@material-ui/icons";

export interface ExpandCardProps extends CardProps {
    title: string;
    defaultExpand?: boolean;
    icon?: SvgIconComponent | null;
}

export const ExpandCard = (props: ExpandCardProps) => {
    const { title, children, defaultExpand, icon: Icon = ExpandMore, ...cardProps } = props;
    const [expand, setCollapsed] = useState(defaultExpand);
    return (
        <Card {...cardProps}>
            <CardHeader
                title={
                    <Grid container justifyContent="space-between" alignItems="center" spacing={2} onClick={() => setCollapsed(!expand)}>
                        <span>{title}</span>
                        {Icon &&
                            <Icon fontSize="medium" style={{
                                transform: expand ? 'rotate(-180deg)' : 'rotate( 0deg)',
                                transition: 'transform .5s'
                            }} />
                        }
                    </Grid>
                }
                style={{ cursor: 'pointer' }}
            />
            <Collapse in={expand}>
                {children}
            </Collapse>
        </Card>
    );
};
