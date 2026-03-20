import { Button } from "../button/button";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import "./navbar.css";

export const Navbar = () => {
    const navigate = useNavigate()
    return <nav>
        {/* oh ja ik vind animations leuk. */}
        <motion.div
            className="flex flex-row justify-left items-center gap-3"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
        >
            <div className={'navbar'}>
                <Button variant='secondary' onClick={() => { navigate('/app') }}>Home</Button>
                <Button variant='secondary' onClick={() => { navigate('/app/forum') }}>Forum</Button>
            </div>
        </motion.div>
    </nav>;
}