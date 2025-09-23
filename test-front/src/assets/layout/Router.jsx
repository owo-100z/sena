import { Routes, Route } from 'react-router-dom';
import Home from "@/views/home/Home";
// import Specs from '@/views/home/Specs';
import Users from "@/views/guild/Users";
// import GuildSpec from "@/views/guild/GuildSpec";
import SiegeRecord from '@/views/guild/SiegeRecord';
import SiegeRecordTable from '@/views/guild/SiegeRecordTable';
// import Code from '@/views/setting/Code';
// import Hero from '@/views/setting/Hero';
import Error404 from '@/assets/err/Error404';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/specs" element={<Specs />} /> */}
      <Route path="/users" element={<Users />} />
      {/* <Route path="/guild-spec" element={<GuildSpec />} /> */}
      <Route path="/siege-record" element={<SiegeRecord />} />
      <Route path="/siege-record-table" element={<SiegeRecordTable />} />
      {/* <Route path="/code" element={<Code />} /> */}
      {/* <Route path="/hero" element={<Hero />} /> */}
      <Route path="*" element={<Error404 />}/>
    </Routes>
  )
}