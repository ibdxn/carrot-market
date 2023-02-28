import type { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";
import { Post, Review } from "@prisma/client";
import Router, { useRouter } from "next/router";
import useCoords from "@libs/client/useCoords";
import Input from "@components/input";

interface ReviewForm {
  review: string;
  score: number;
}

interface ReviewResponse {
  ok: boolean;
  reviews: Review;
}

const Write: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<ReviewForm>();

  const [Createreview, { loading, data }] =
    useMutation<ReviewResponse>("/api/reviews");
  const onValid = (data: ReviewForm) => {
    if (loading) return;
    Createreview({
      ...data,
      createdById: Number(router.query.createdById),
      createdForId: Number(router.query.createdForId),
    });
  };
  useEffect(() => {
    if (data && data.ok) {
      router.push(`/`);
    }
  }, [data, router]);
  return (
    <Layout canGoBack title="Write Review">
      <form onSubmit={handleSubmit(onValid)} className="p-4 space-y-4">
        <Input
          required={true}
          type="number"
          name="rating"
          register={register("score", {
            required: true,
            pattern: /^[1-5]+$/,
            minLength: 1,
            maxLength: 1,
            valueAsNumber: true,
          })}
          label="Rating : 1 ~ 5"
        />
        <TextArea
          register={register("review", { required: true, minLength: 5 })}
          required
          placeholder="Write a Review!"
        />
        <Button text={loading ? "Loading..." : "Submit"} />
      </form>
    </Layout>
  );
};

export default Write;
