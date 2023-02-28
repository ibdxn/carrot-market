import Layout from "@components/layout";
import Message from "@components/message";
import useMutation from "@libs/client/useMutation";
import useUser from "@libs/client/useUser";
import { ChatMessages, ChatRoom, User } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

interface ChatRoomWithMessages extends ChatRoom {
  chatMessages: ChatMessages[];
  host: User;
  invited: User;
}

interface ChatMessagesResponse {
  ok: boolean;
  chatRoom: ChatRoomWithMessages;
}

interface MessageForm {
  message: string;
}

const ChatDetail: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { data: messageData, mutate } = useSWR<ChatMessagesResponse>(
    router.query.id ? `/api/chats/${router.query.id}` : null
  );
  const { register, handleSubmit, reset } = useForm<MessageForm>();
  const [sendMessage, { data, loading }] = useMutation(
    `/api/chats/${router.query.id}/messages`
  );
  const onValid = (form: MessageForm) => {
    if (!messageData) return;
    reset();
    mutate(
      (prev) =>
        prev &&
        ({
          ...messageData,
          chatRoom: {
            ...messageData.chatRoom,
            chatMessages: [
              ...messageData.chatRoom.chatMessages,
              {
                id: Date.now(),
                message: form.message,
                userId: user?.id,
              },
            ],
          },
        } as any),
      false
    );
    if (loading) return;
    sendMessage(form);
  };

  const onWriteReviewClick = () => {
    router.push(
      `/review?createdById=${messageData?.chatRoom.hostId}&createdForId=${messageData?.chatRoom.invitedId}`
    );
  };
  return (
    <Layout title={messageData?.chatRoom.invited.name} canGoBack>
      <div className="border-y-[1px] flex">
        {
          <div className="flex  ml-auto mx-5">
            <button
              onClick={onWriteReviewClick}
              className=" inline-block my-2 px-3 py-2 rounded-md bg-orange-500 text-white cursor-pointer hover:bg-orange-600 text-sm "
            >
              리뷰쓰기
            </button>
          </div>
        }
      </div>
      <div className=" py-5 px-4 space-y-4">
        {messageData?.chatRoom?.chatMessages.map((message) => (
          <Message
            key={message.id}
            message={message.message}
            reversed={
              message.userId === messageData.chatRoom.host.id ? true : false
            }
            avatarUrl={
              message.userId === messageData.chatRoom.host.id
                ? messageData.chatRoom.host.avatar
                : messageData.chatRoom.invited.avatar
            }
          />
        ))}
        <div className="fixed w-full mx-auto max-w-md bottom-2 inset-x-0">
          <form
            onSubmit={handleSubmit(onValid)}
            className="flex relative items-center"
          >
            <input
              {...register("message", { minLength: 1 })}
              type="text"
              className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:border-orange-500 pr-12"
            />
            <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
              <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 text-sm text-white hover:bg-orange-600 cursor-pointer">
                &rarr;
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ChatDetail;
