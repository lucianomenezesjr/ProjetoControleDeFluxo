import Image from "next/image";

export default function Logo(){
    return(
        <div>
            <Image
                src="/senai_logo.png"
                alt="Logo da empresa"
                width={4000}
                height={2000}
                className="p-8"
            />
        </div>
    )
}