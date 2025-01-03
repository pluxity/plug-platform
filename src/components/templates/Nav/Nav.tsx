import Button from "@/components/atoms/buttons";
import sample from "../../../../public/icons/sample.svg";
import Image from "next/image";



const Nav = () => {
    return (
        <nav className="fixed w-full pt-4 text-2xl bg-transparent flex justify-center text-violet-50">
            <p>플럭시티 관제 플랫폼</p>
            <Button variant="text" size="medium" color="primary">
                Text Button
            </Button>
            <Button variant="icon" size="small" color="secondary">
                <span>
                    <Image src={sample} alt="sample"></Image>
                </span>
            </Button>
            <Button variant="outlined" size="large" color="primary">
                 <span>
                    <Image priority src={sample} alt="sample"/> 
                </span> Launch
            </Button>
        </nav>
    )
}

export default Nav;