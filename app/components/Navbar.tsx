import Link from "next/link"


const Navbar = () => {

  return (
    <>
      <div className="flex justify-around p-4 bg-gray-700">
        <div className="font-extrabold text-2xl cursor-pointer text-amber-400">HireFlow</div>
        <div>
          <ul className="flex space-x-8 font-bold ">
            <Link href="/" className="cursor-pointer hover:text-blue-400 ">Home</Link>
            <Link href="/about" className="cursor-pointer hover:text-blue-400 ">About</Link>
            <Link href="/contactUs" className="cursor-pointer hover:text-blue-400 ">Contact Us</Link>
            <Link href="/login" className="cursor-pointer hover:text-blue-400 ">Login</Link>
            <Link href="/register" className="cursor-pointer hover:text-blue-400 ">SignUp</Link>
          </ul>
        </div>

      </div >
    </>
  )
}

export default Navbar