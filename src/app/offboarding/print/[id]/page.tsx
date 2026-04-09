import { supabaseAdmin as supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { notFound } from "next/navigation";
import PrintAction from "@/components/PrintAction";

export default async function PrintResignPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const parsedId = parseInt(resolvedParams.id);
  
  if (isNaN(parsedId)) {
    return notFound();
  }

  const { data, error } = await supabase
    .from("resignations")
    .select("*, employees(nama_lengkap, nip, posisi, sektor, regu)")
    .eq("id", parsedId)
    .single();

  if (error || !data) return notFound();

  const formattedDate = format(new Date(), "dd MMMM yyyy", { locale: idLocale });
  
  let labelTipe = "resign normal";
  if (data.tipe === "MENDADAK") labelTipe = "resign mendadak";
  else if (data.tipe === "PHK") labelTipe = "pemutusan hubungan kerja (PHK)";
  else if (data.tipe === "TANPA_BERITA") labelTipe = "pengunduran diri sepihak (tanpa berita)";

  return (
    <div className="bg-white min-h-screen font-body text-black flex justify-center print:bg-white print:m-0">
      <div className="w-[210mm] min-h-[297mm] bg-white p-[25.4mm] shadow-2xl print:shadow-none print:p-[20mm] mx-auto relative text-base">
        <div className="text-right mb-12">
          <p>Majalengka, {formattedDate}</p>
        </div>

        <div className="mb-8">
          <p>Kepada</p>
          <p>Yth. Bapak/Ibu Pimpinan</p>
          <p>PT. Mitra Sigma Tekindo</p>
          <p>Di Tempat</p>
        </div>

        <div className="mb-6">
          <p>Dengan hormat, yang bertandatangan dibawah ini:</p>
        </div>

        <table className="mb-6 ml-4">
          <tbody>
            <tr>
              <td className="w-40 py-1 uppercase">NAMA</td>
              <td className="px-2">:</td>
              <td className="uppercase font-semibold">{data.employees?.nama_lengkap}</td>
            </tr>
            <tr>
              <td className="w-40 py-1 uppercase">NO KARYAWAN</td>
              <td className="px-2">:</td>
              <td className="uppercase font-semibold">{data.employees?.nip}</td>
            </tr>
            <tr>
              <td className="w-40 py-1 uppercase">DEPARTEMEN</td>
              <td className="px-2">:</td>
              <td className="uppercase font-semibold">Produksi</td>
            </tr>
            <tr>
              <td className="w-40 py-1 uppercase">JABATAN</td>
              <td className="px-2">:</td>
              <td className="uppercase font-semibold">{data.employees?.posisi} Sektor {data.employees?.sektor} - Regu {data.employees?.regu}</td>
            </tr>
          </tbody>
        </table>

        <div className="space-y-4 text-justify leading-relaxed indent-8">
          <p>
            Melalui surat ini, saya bermaksud mengajukan mengundurkan diri dari PT Mitra Sigma Tekindo dengan status {labelTipe}.
          </p>

          <p>
            Saya ucapkan terimakasih atas kepercayaan, kesempatan dan bimbingan serta pengalaman berharga yang pernah saya dapatkan selama bekerja di PT Mitra Sigma Tekindo. Tidak lupa saya menyampaikan permohonan maaf bila ada kata dan tindakan salah kepada seluruh jajaran serta rekan PT Mitra Sigma Tekindo.
          </p>

          <p>
            Demikian surat ini saya buat, dalam keadaan sehat jasmani dan rohani tanpa ada paksaan dari pihak manapun. Harapan saya semoga PT Mitra Sigma Tekindo senantiasa bisa terus berkembang ke arah positif dan selalu menjadi yang terbaik.
          </p>
        </div>

        <div className="mt-20 flex justify-start">
          <div className="text-center w-64 ml-8">
            <p className="mb-24">Yang Mengajukan,</p>
            <div className="border-b border-black w-full mb-2"></div>
          </div>
        </div>
      </div>

      <PrintAction />
    </div>
  );
}
